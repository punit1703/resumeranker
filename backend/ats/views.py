import os
import json
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from .parser.resume_parser import extract_text
from .scoring.ats_score import calculate_ats_score
from .ranking.ranker import rank_resumes
from .resume_builder.builder import build_resume
from .resume_builder.pdf_generator import generate_pdf
from .models import Job, Application, UserProfile

# --- ATS ENDPOINTS ---

@csrf_exempt
@api_view(['GET'])
def health_check(request):
    return Response({'status': 'Backend Running...'})

@api_view(['POST'])
def register(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'candidate')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
        
    user = User.objects.create_user(username=username, password=password)
    UserProfile.objects.create(user=user, role=role)
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({'token': token.key, 'role': role, 'user_id': user.id})

@api_view(['POST'])
def login(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        role = user.profile.role if hasattr(user, 'profile') else 'candidate'
        return Response({'token': token.key, 'role': role, 'user_id': user.id})
    else:
        return Response({'error': 'Invalid credentials'}, status=401)

@api_view(['POST'])
def upload_resume(request):
    resume = request.FILES.get('resume')

    if not resume:
        return Response({'error': 'No resume uploaded'}, status=400)
    
    file_path = default_storage.save(resume.name, resume)
    full_path = default_storage.path(file_path)

    text = extract_text(full_path)

    os.remove(full_path)

    return Response({
        'filename': resume.name,
        'text_preview': text
    })

@api_view(['POST'])
def ats_score(request):
    resume = request.FILES.get('resume')
    job_desc_id = request.data.get('job_desc_id')
    custom_job_desc = request.data.get('custom_job_desc')

    if not resume:
        return Response({'error': 'Missing resume file.'}, status=400)

    file_path = default_storage.save(resume.name, resume)
    full_path = default_storage.path(file_path)
    resume_text = extract_text(full_path)
    os.remove(full_path)

    final_job_desc = ""
    job_obj = None

    if job_desc_id:
        try:
            job_obj = Job.objects.get(id=job_desc_id)
            final_job_desc = job_obj.description
            try:
                skills = json.loads(job_obj.skills)
                if skills:
                    final_job_desc += "\n\nRequired Skills: " + ", ".join(skills)
            except json.JSONDecodeError:
                pass
        except Job.DoesNotExist:
            return Response({'error': 'Job description not found for provided ID'}, status=404)
    elif custom_job_desc:
        final_job_desc = custom_job_desc
    else:
        return Response({'error':'Missing job description (either ID or custom text required)'}, status=400)

    score = calculate_ats_score(resume_text, final_job_desc)

    return Response({
        'ats_score': score
    })

@api_view(['POST'])
def rank_multiple_resumes(request):
    job_id = request.data.get('job_id')
    files = request.FILES.getlist('resumes')
    use_existing = request.data.get('use_existing', 'false').lower() == 'true'

    if not job_id:
        return Response({'error': 'Missing job selection'}, status=400)
        
    if not files and not use_existing:
        return Response({'error': 'Missing resumes'}, status=400)
    
    try:
        job = Job.objects.get(id=job_id)
        job_desc = job.description
        # Append skills if available
        try:
            if job.skills:
                skills = json.loads(job.skills)
                if skills:
                    job_desc += "\n\nRequired Skills: " + ", ".join(skills)
        except:
            pass
            
    except Job.DoesNotExist:
        return Response({'error': 'Selected job not found'}, status=404)
    
    extracted_resumes = []

    if use_existing:
        applications = job.applications.all()
        for app in applications:
            if app.resume_file:
                try:
                    full_path = app.resume_file.path
                    text = extract_text(full_path)
                    extracted_resumes.append({'filename': app.candidate_name, 'text': text})
                except Exception as e:
                    print(f"Error extracting text for {app.candidate_name}: {e}")
                    pass
    else:
        for resume in files:
            file_path = default_storage.save(resume.name, resume)
            full_path = default_storage.path(file_path)

            text = extract_text(full_path)

            extracted_resumes.append({'filename': resume.name, 'text':text})

            os.remove(full_path)

    if not extracted_resumes:
        return Response({'error': 'No resumes found to rank'}, status=400)

    ranked_resume = rank_resumes(extracted_resumes, job_desc)

    return Response({
        'total_resumes': len(ranked_resume),
        'ranked_candidates': ranked_resume,
        'job_title': job.title
    })

@api_view(['POST'])
def generate_resume(request):
    data = request.data

    if not data.get('name'):
        return Response({'error': 'Name is required'}, status=400)

    pdf_buffer = generate_pdf(data)

    response = HttpResponse(
        pdf_buffer,
        content_type='application/pdf'
    )
    response['Content-Disposition'] = 'attachment; filename="ATS_Resume.pdf"'
    return response

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_job(request):
    try:
        data = request.data
        print("Received Job Data:", data) # Debugging

        required_fields = ["title", "company_name", "description"]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Field '{field}' is required."}, status=400)

        min_score = data.get("min_score_required")
        if min_score is None or min_score == "":
            min_score = 50
        
        try:
            min_score = float(min_score)
        except ValueError:
             return Response({"error": "Invalid value for Minimum ATS Score"}, status=400)

        skills_list = data.get("skills", [])
        if isinstance(skills_list, str):
            try:
                skills_list = json.loads(skills_list)
            except:
                skills_list = []
        
        skills_json = json.dumps(skills_list)

        job = Job.objects.create(
            employer=request.user,
            title=data.get("title"),
            company_name=data.get("company_name"),
            description=data.get("description"),
            skills=skills_json,
            min_score_required=min_score
        )

        return Response({"message": "Job created successfully"})
    except Exception as e:
        print(f"Error creating job: {e}")
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def apply_job(request, job_id):
    job = Job.objects.get(id=job_id)

    resume = request.FILES.get("resume")
    candidate_name = request.data.get("candidate_name")

    if not resume:
        return Response({"error": "Resume required"}, status=400)

    file_path = default_storage.save(resume.name, resume)
    full_path = default_storage.path(file_path)

    resume_text = extract_text(full_path)
    os.remove(full_path)

    score = calculate_ats_score(resume_text, job.description)

    if score < job.min_score_required:
        return Response({
            "eligible": False,
            "ats_score": score,
            "message": "You are not eligible for this job"
        })

    Application.objects.create(
        candidate=request.user,
        job=job,
        candidate_name=candidate_name,
        resume_file=resume,
        ats_score=score
    )

    return Response({
        "eligible": True,
        "ats_score": score,
        "message": "Application submitted successfully"
    })

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def list_jobs(request):
    jobs = Job.objects.all()
    if request.GET.get('my_jobs') == 'true' and request.user.is_authenticated:
        jobs = jobs.filter(employer=request.user)
    jobs = jobs.order_by("-created_at")

    data = [
        {
            "id": job.id,
            "title": job.title,
            "company": job.company_name,
            "min_score_required": job.min_score_required
        }
        for job in jobs
    ]

    return Response(data)

@api_view(['GET'])
def get_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    skills_list = []
    try:
        if job.skills:
            skills_list = json.loads(job.skills)
    except:
        pass

    data = {
        "id": job.id,
        "title": job.title,
        "company": job.company_name,
        "description": job.description,
        "skills": skills_list,
        "min_score_required": job.min_score_required
    }
    return Response(data)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_applications(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)
        
    if job.employer != request.user:
        return Response({"error": "Forbidden: You do not own this job"}, status=403)
        
    applications = job.applications.all().order_by("-ats_score")
    
    data = [
        {
            "id": app.id,
            "candidate_name": app.candidate_name,
            "ats_score": app.ats_score,
            "applied_at": app.applied_at,
            "resume_url": request.build_absolute_uri(app.resume_file.url) if app.resume_file else None
        }
        for app in applications
    ]
    
    return Response(data)

@api_view(['POST', 'GET'])
def rank_jobs_for_resume(request):
    resume = request.FILES.get('resume')

    if not resume:
        return Response({'error': 'Missing resume file.'}, status=400)

    file_path = default_storage.save(resume.name, resume)
    full_path = default_storage.path(file_path)
    resume_text = extract_text(full_path)
    os.remove(full_path)

    jobs = Job.objects.all()
    ranked_jobs = []

    for job in jobs:
        full_job_desc = job.description
        try:
            if job.skills:
                skills = json.loads(job.skills)
                if skills:
                    full_job_desc += "\n\nRequired Skills: " + ", ".join(skills)
        except:
            pass
        
        score = calculate_ats_score(resume_text, full_job_desc)
        
        ranked_jobs.append({
            "id": job.id,
            "title": job.title,
            "company": job.company_name,
            "score": score,
            "min_score": job.min_score_required,
            "eligible": score >= job.min_score_required
        })
    
    ranked_jobs.sort(key=lambda x: x['score'], reverse=True)

    return Response(ranked_jobs)
