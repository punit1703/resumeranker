from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_ats_score(resume_text: str, job_desc: str) -> float:
    if not resume_text or not job_desc:
        return 0.0

    try:
        text = [resume_text, job_desc]
        cv = CountVectorizer()
        count_matrix = cv.fit_transform(text)
        
        match_percentage = cosine_similarity(count_matrix)[0][1] * 100
        return round(match_percentage, 2)
    except Exception:
        return 0.0

def skill_gap_analysis(resume_text: str, job_desc: str) -> dict:
    # Simple extraction of potential keywords (capitalized words or known skills)
    # Ideally, use a proper NER model or predefined skill list.
    # For now, we use a basic set difference on unique words.
    
    cv = CountVectorizer(stop_words='english')
    try:
        # Get all words from job description
        job_matrix = cv.fit_transform([job_desc])
        job_features = cv.get_feature_names_out()
        
        # Get words from resume
        resume_matrix = cv.transform([resume_text])
        # We can't reuse valid features because transform expects the same vocabulary.
        # But we want to check PRESENCE.
        
        # Simpler approach: Check if job keywords are in resume
        missing = []
        resume_lower = resume_text.lower()
        
        # Filter for "interesting" words (e.g., nouns, skills). 
        # Since we don't have NLTK/Spacy, we use heuristic: words > 4 chars, occurring in job desc.
        for word in job_features:
            if len(word) > 4 and word not in resume_lower: # Simple check
                missing.append(word)
        
        # Limit to top 5 missing
        missing = missing[:5]
        
        suggestions = []
        if missing:
            suggestions.append(f"Try to include keywords like: {', '.join(missing)}")
        
        return {
            "missing_skills": missing,
            "suggestions": suggestions
        }
    except:
        return {"missing_skills": [], "suggestions": []}
