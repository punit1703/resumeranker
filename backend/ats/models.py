from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=[("candidate", "candidate"), ("company", "company")])

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Job(models.Model):
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="jobs", null=True)
    title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    description = models.TextField()
    skills = models.TextField(default="[]") # Storing as JSON string
    min_score_required = models.FloatField(default=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.company_name}"


class Application(models.Model):
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name="applications", null=True, blank=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    candidate_name = models.CharField(max_length=200)
    resume_file = models.FileField(upload_to="applications/")
    ats_score = models.FloatField()
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate_name} - {self.job.title}"
