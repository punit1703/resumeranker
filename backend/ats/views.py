import os
from django.http import FileResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from .parser.resume_parser import extract_text
from .scoring.ats_score import calculate_ats_score
from django.views.decorators.csrf import csrf_exempt
from .ranking.ranker import rank_resumes
from .resume_builder.builder import build_resume
from .resume_builder.pdf_generator import generate_pdf
from .analysis.skill_gap import skill_gap_analysis

@csrf_exempt
@api_view(['GET'])
def health_check(request):
    return Response({'status': 'Backend Running...'})

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
    resume_text = request.data.get('resume_text')
    job_desc = request.data.get('job_desc')

    if not resume_text or not job_desc:
        return Response({'error':'Missing Data'}, status=400)
    
    score = calculate_ats_score(resume_text, job_desc)
    gap_analysis = skill_gap_analysis(resume_text, job_desc)

    return Response({
        'ats_score': score,
        'missing_skills': gap_analysis['missing_skills'],
        'suggestions': gap_analysis['suggestions']
    })

@api_view(['POST'])
def rank_multiple_resumes(request):
    job_desc = request.data.get('job_desc')
    files = request.FILES.getlist('resumes')

    if not job_desc or not files:
        return Response({'error': 'Missing job description or resumes'}, status=400)
    
    extracted_resumes = []

    for resume in files:
        file_path = default_storage.save(resume.name, resume)
        full_path = default_storage.path(file_path)

        text = extract_text(full_path)

        extracted_resumes.append({'filename': resume.name, 'text':text})

        os.remove(full_path)

    ranked_resume = rank_resumes(extracted_resumes, job_desc)

    return Response({
        'total_resumes': len(ranked_resume),
        'ranked_candidates': ranked_resume
    })

@api_view(['POST'])
def generate_resume(request):
    data = request.data

    if not data.get('name'):
        return Response({'error': 'Name is Required'}, status=400)
    
    resume_text = build_resume(data)
    pdf_path = generate_pdf(resume_text)

    return FileResponse(
        open(pdf_path, "rb"),
        as_attachment=True,
        filename="ATS_Resume.pdf"
    )