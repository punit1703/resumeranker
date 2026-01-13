def build_resume(data):
    resume = []

    resume.append(data.get("name", "").upper())
    resume.append(
        f"Email: {data.get('email', '')} | Phone: {data.get('phone', 'N/A')}"
    )
    resume.append("-" * 50)

    if data.get("skills"):
        resume.append("SKILLS")
        resume.append(data["skills"])
        resume.append("")

    if data.get("education"):
        resume.append("EDUCATION")
        resume.append(data["education"])
        resume.append("")

    if data.get("experience"):
        resume.append("EXPERIENCE")
        resume.append(data["experience"])
        resume.append("")

    return "\n".join(resume)
