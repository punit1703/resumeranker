from .skill_utils import extract_skills

def skill_gap_analysis(resume_text: str, job_desc: str):
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_desc)

    missing = sorted(jd_skills - resume_skills)

    return {
        "missing_skills": missing,
        "suggestions": [
            f"Add projects or experience related to '{skill}'"
            for skill in missing[:5]
        ],
    }
