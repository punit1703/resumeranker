import os
import django
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from ats.models import Job, Application, User

def seed_applicants():
    jobs = Job.objects.all()
    if not jobs.exists():
        print("No job postings found. Please create a job posting first.")
        return

    dummy_names = [
        "Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", 
        "Evan Davis", "Fiona Gallagher", "George Miller", "Hannah Montana"
    ]

    for job in jobs:
        print(f"Creating applicants for job: {job.title}")
        num_applicants = random.randint(3, 6) # Generate 3 to 6 applicants per job
        
        # Determine the user for candidate (we can just leave it blank since it's optional in models.py, 
        # but let's see if we want to create dummy candidate users. The model says: 
        # candidate = models.ForeignKey(User, null=True, blank=True)
        # So it's fine to leave it null.
        
        for _ in range(num_applicants):
            name = random.choice(dummy_names)
            dummy_names.remove(name) # avoid duplicates where possible, but if run multiple times we might run out.
            # let's just use random choice without removing to be safe
            dummy_names.append(name) # put it back

            name = random.choice(["Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Evan Davis", "Fiona Gallagher", "George Miller", "Hannah Montana", "Ian Somerhalder", "Jenny Jenkins"])
            
            # random score between 30 and 95
            score = round(random.uniform(30.0, 95.0), 1)

            # Create an application
            app = Application.objects.create(
                job=job,
                candidate_name=name,
                resume_file=f"applications/{name.replace(' ', '_').lower()}_resume.pdf",
                ats_score=score
            )
            print(f"  - Created applicant: {name} (Score: {score})")

    print("\nSuccessfully added dummy applicants!")

if __name__ == '__main__':
    seed_applicants()
