from django.urls import path
from .views import (
    health_check, 
    upload_resume, 
    ats_score, 
    rank_multiple_resumes, 
    generate_resume, 
    create_job, 
    apply_job, 
    list_jobs, 
    get_job, 
    list_applications, 
    rank_jobs_for_resume,
    register,
    login
)

urlpatterns = [
    path('auth/register/', register),
    path('auth/login/', login),
    path('health/', health_check),
    path('upload/', upload_resume),
    path('score/', ats_score),
    path('rank/', rank_multiple_resumes),
    path('generate-resume/', generate_resume),
    path("jobs/create/", create_job),
    path("jobs/", list_jobs),
    path("jobs/<int:job_id>/", get_job),
    path("jobs/<int:job_id>/apply/", apply_job),
    path("jobs/<int:job_id>/applications/", list_applications, name='list_applications'),
    path('applications/<int:job_id>/', list_applications, name='list_applications_new'),
    path('rank-jobs/', rank_jobs_for_resume, name='rank_jobs_for_resume'),
]