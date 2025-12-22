from ats.scoring.ats_score import calculate_ats_score

def rank_resumes(resumes, job_desc):
    results = []

    for resume in resumes:
        score = calculate_ats_score(resume['text'], job_desc)
        results.append({'filename': resume['filename'], 'ats_score':score})

    results.sort(key=lambda x: x['ats_score'], reverse=True)

    return results
