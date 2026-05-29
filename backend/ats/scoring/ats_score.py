import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def extract_relevant_sections(resume_text: str) -> str:
    lines = resume_text.split('\n')
    experience_text = []
    skills_text = []
    
    current_section = None
    
    exp_pattern = re.compile(r'^(\*?\*?)?\s*(work\s+)?(professional\s+)?(employment\s+)?experience\s*(\*?\*?)?:?$', re.IGNORECASE)
    history_pattern = re.compile(r'^(\*?\*?)?\s*(employment\s+)?history\s*(\*?\*?)?:?$', re.IGNORECASE)
    skills_pattern = re.compile(r'^(\*?\*?)?\s*(technical\s+)?(key\s+)?(core\s+)?skills\s*(\*?\*?)?:?$', re.IGNORECASE)
    competencies_pattern = re.compile(r'^(\*?\*?)?\s*(core\s+)?competencies\s*(\*?\*?)?:?$', re.IGNORECASE)
    other_pattern = re.compile(r'^(\*?\*?)?\s*(education|projects|certifications|summary|objective|languages|interests)\s*(\*?\*?)?:?$', re.IGNORECASE)
    
    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue
            
        if exp_pattern.match(line_clean) or history_pattern.match(line_clean):
            current_section = 'experience'
            continue
        elif skills_pattern.match(line_clean) or competencies_pattern.match(line_clean):
            current_section = 'skills'
            continue
        elif other_pattern.match(line_clean):
            current_section = None
            continue
            
        if current_section == 'experience':
            experience_text.append(line)
        elif current_section == 'skills':
            skills_text.append(line)
            
    combined_text = ""
    if experience_text:
        combined_text += "\n".join(experience_text) + "\n"
    if skills_text:
        combined_text += "\n".join(skills_text) + "\n"
        
    combined_text = combined_text.strip()
    
    if not combined_text:
        return resume_text
        
    return combined_text

def calculate_ats_score(resume_text: str, job_desc: str) -> float:
    if not resume_text or not job_desc:
        return 0.0

    relevant_resume_text = extract_relevant_sections(resume_text)

    try:
        text = [relevant_resume_text, job_desc]
        cv = CountVectorizer()
        count_matrix = cv.fit_transform(text)
        
        match_percentage = cosine_similarity(count_matrix)[0][1] * 100
        return round(match_percentage, 2)
    except Exception:
        return 0.0