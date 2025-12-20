from django.urls import path
from .views import health_check, upload_resume, ats_score

urlpatterns = [
    path('health/', health_check),
    path('upload/', upload_resume),
    path('score/', ats_score)
]