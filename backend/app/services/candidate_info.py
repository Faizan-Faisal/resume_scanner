import json
import re
from app.services.llm import llm


def extract_email(text: str):

    if not text:
        return None

    # Normalize text
    cleaned_text = text.replace("\n", " ").replace("\t", " ")

    # Remove spaces around @
    cleaned_text = re.sub(r"\s*@\s*", "@", cleaned_text)

    # Strong email regex
    pattern = r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b"

    matches = re.findall(pattern, cleaned_text)

    if not matches:
        return None

    # Remove duplicates
    matches = list(set(matches))

    # Prefer common domains if multiple found
    common_domains = ["gmail", "outlook", "yahoo", "hotmail", "edu"]

    for email in matches:
        for domain in common_domains:
            if domain in email.lower():
                return email

    # Otherwise return first valid email
    return matches[0]


def extract_candidate_info(text: str):

    # Send top + bottom to LLM
    resume_text = text[:2000] + text[-2000:]

    prompt = f"""
    Extract candidate information from this resume text.

    Return ONLY valid JSON.

    {{
      "name": "",
      "email": ""
    }}

    Resume Text:
    {resume_text}
    """

    response = llm.invoke(prompt)

    try:
        result = json.loads(response.text)

        name = result.get("name")
        email = result.get("email")

        # Validate email
        if not email or "@" not in email:
            email = extract_email(text)

        return {
            "name": name,
            "email": email
        }

    except Exception:

        return {
            "name": None,
            "email": extract_email(text)
        }