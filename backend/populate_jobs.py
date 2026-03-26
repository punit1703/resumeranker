import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from ats.models import Job, UserProfile

# 1. Remove all existing jobs
Job.objects.all().delete()
print("Cleared all existing jobs.")

# 2. Create/get two employer accounts
employer1, _ = User.objects.get_or_create(username='DeepMind_HR', email='hr@deepmind.com')
employer1.set_password('password123')
employer1.save()
UserProfile.objects.get_or_create(user=employer1, defaults={'role': 'company'})

employer2, _ = User.objects.get_or_create(username='StarkIndustries_HR', email='careers@stark.com')
employer2.set_password('password123')
employer2.save()
UserProfile.objects.get_or_create(user=employer2, defaults={'role': 'company'})

# 3. Create new jobs
jobs_data = [
    {
        'title': 'Machine Learning Engineer',
        'company_name': 'Google DeepMind',
        'description': 'We are looking for an exceptional ML Engineer to push the boundaries of AI research and build state-of-the-art foundation models.',
        'skills': ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Neural Networks', 'JAX'],
        'min_score_required': 80.0,
        'employer': employer1
    },
    {
        'title': 'Data Scientist',
        'company_name': 'Google DeepMind',
        'description': 'Looking for a Senior Data Scientist to analyze complex, unstructured datasets and provide actionable insights for our core alignment team.',
        'skills': ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Data Visualization', 'Statistics'],
        'min_score_required': 75.0,
        'employer': employer1
    },
    {
        'title': 'Frontend Developer',
        'company_name': 'Stark Industries',
        'description': 'Seeking a talented Frontend Developer to build modern, highly-responsive HUD interfaces for our next generation iron suits.',
        'skills': ['JavaScript', 'React', 'HTML', 'CSS', 'TailwindCSS', 'WebGL', 'Three.js'],
        'min_score_required': 60.0,
        'employer': employer2
    },
    {
        'title': 'Backend Developer',
        'company_name': 'Stark Industries',
        'description': 'We need a robust Backend Developer to design, implement, and secure scalable APIs powering our Arc Reactor grid.',
        'skills': ['Python', 'Django', 'PostgreSQL', 'REST API', 'Cybersecurity', 'AWS', 'Docker'],
        'min_score_required': 70.0,
        'employer': employer2
    },
    {
        'title': 'Fullstack Engineer',
        'company_name': 'Stark Industries',
        'description': 'Join our cross-functional team as a Fullstack Engineer working on both the client and server side of our global orbital defense net.',
        'skills': ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'GraphQL', 'TypeScript'],
        'min_score_required': 85.0,
        'employer': employer2
    }
]

for job_data in jobs_data:
    Job.objects.create(**job_data)

print(f"Successfully created {len(jobs_data)} new jobs across 2 different employers!")
