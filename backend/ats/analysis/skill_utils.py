import re
from .skills import SKILLS

def extract_skills(text: str) -> set:
    text = text.lower()
    found = set()

    for skill, meta in SKILLS.items():
        for v in meta["variants"]:
            pattern = rf"\b{re.escape(v)}\b"
            if re.search(pattern, text):
                found.add(skill)
                break

    return found
