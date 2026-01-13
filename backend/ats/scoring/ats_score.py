from ats.analysis.skill_utils import extract_skills
from ats.analysis.skills import SKILLS

def calculate_ats_score(resume_text: str, job_desc: str) -> float:
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_desc)

    total_weight = sum(SKILLS[s]["weight"] for s in jd_skills)
    matched_weight = sum(
        SKILLS[s]["weight"] for s in jd_skills if s in resume_skills
    )

    if total_weight == 0:
        return 0.0

    return round((matched_weight / total_weight) * 100, 2)
