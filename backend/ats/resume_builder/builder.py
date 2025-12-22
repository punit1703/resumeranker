def build_resume(data):
    resume = []
    
    resume.append(data['name'].upper())
    resume.append(f'Email: {data.get('email', '')} | Phone: {data.get('phone', '')}')
    resume.append('')

    if data.get('summary'):
        resume.append('SUMMARY')
        resume.append(data['summary'])
        resume.append('')

    if data.get('skills'):
        resume.append('SKILLS')
        resume.append(data['skills'])
        resume.append('')

    if data.get('experience'):
        resume.append('EXPERIENCE')
        for exp in data['experience']:
            resume.append(f'{exp['role']} - {exp['company']}')
            resume.append(f'{exp['description']}')
            resume.append('')

    if data.get('projects'):
        resume.append('PROJECTS')
        for project in data['projects']:
            resume.append(project['title'])
            resume.append(project['description'])
            resume.append('')

    if data.get('education'):
        resume.append('EDUCATION')
        resume.append(data['education'])

    return '\n'.join(resume)