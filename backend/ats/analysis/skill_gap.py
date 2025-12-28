from ats.scoring.text_utils import clean_text

GENERIC_STOP_WORDS = {
    "and", "or", "with", "for", "the", "a", "to", "in", "of", "on",
    "using", "experience", "knowledge", "ability", "are", "is",
    "be", "will", "should", "can", "must", "strong",
    "hands", "responsibilities", "requirements",
    "work", "working", "team", "teams",
    "build", "develop", "analyze", "collaborate",
    "cross", "functional", "understanding",
    "role", "position", "job", "candidate","requirement", "requirements",
    "responsibility", "responsibilities",
    "feature", "features"
}

GENERIC_ROLE_WORDS = {
    "engineer", "developer", "analyst", "manager",
    "candidate", "role", "position", "job", "hiring",
    "company", "organization", "team", "large"
}

GENERIC_PHRASES = {
    "cross functional",
    "hands on"
}

WORD_CORRECTIONS = {
    "preproces": "preprocessing",
    "responsibilitie": "responsibility"
}


def normalize_word(word):
    word = word.replace("-", " ")
    word = word.strip(".,:;()[]{}")

    if word in WORD_CORRECTIONS:
        word = WORD_CORRECTIONS[word]

    if word.endswith("s") and len(word) > 4:
        word = word[:-1]

    return word

def extract_keywords(text):
    text = clean_text(text)
    words = text.split()

    keywords = set()

    for word in words:
        if len(word) <= 3:
            continue

        word = normalize_word(word)

        if (
            word
            and word not in GENERIC_STOP_WORDS
            and word not in GENERIC_ROLE_WORDS
            and word not in GENERIC_PHRASES
        ):
            keywords.add(word)

    return set(keywords)



def skill_gap_analysis(resume_text, job_description):
    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(job_description)

    missing_skills = sorted(jd_keywords - resume_keywords)

    suggestions = [
        f"Consider adding experience or examples related to '{skill}'"
        for skill in missing_skills[:5]
    ]

    return {
        "missing_skills": missing_skills[:10],
        "suggestions": suggestions
    }
