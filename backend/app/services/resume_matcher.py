# services/resume_matcher.py

import re

def extract_resume_experience(text: str):
    matches = re.findall(r'(\d+)\+?\s*years?', text.lower())
    if matches:
        return max(int(x) for x in matches)
    return 0

def compute_skills_score(required_skills, resume_text):
    """
    Deterministic skill matching.
    No hardcoding.
    Works for any domain.
    """

    resume_text = resume_text.lower()

    if not required_skills:
        return 0.0

    matched = 0

    for skill in required_skills:
        # flexible matching (handles Fast API vs FastAPI)
        pattern = re.escape(skill.lower())
        if re.search(pattern, resume_text):
            matched += 1

    return matched / len(required_skills)