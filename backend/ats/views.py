import os
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from .parser.resume_parser import extract_text
from .scoring.ats_score import calculate_ats_score
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

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
        'text_preview': text[:500]
    })

@api_view(['POST'])
def ats_score(request):
    resume_text = request.data.get('resume_text')
    job_desc = request.data.get('job_desc')

    if not resume_text or not job_desc:
        return Response({'error':'Missing Data'}, status=400)
    
    score = calculate_ats_score(resume_text, job_desc)

    return Response({
        'ats_score': score
    })