# services/job_parser.py

import json
from app.services.llm import llm
from app.services.embedding import embeddings
from app.db.redis_client import redis_client


def process_job(description: str, job_id: str, weights: dict | None = None):

    prompt = f"""
    Extract hiring requirements from this job description.

    Return JSON ONLY:

    {{
      "required_skills": [],
      "min_experience": number
    }}

    Job Description:
    {description}
    """

    response = llm.invoke(prompt)

    structured = json.loads(response.text)

    required_skills = structured.get("required_skills", [])
    min_experience = structured.get("min_experience", 0)

    # Generate embedding ONCE
    job_embedding = embeddings.embed_query(description)

    weights = {
        "semantic": 0.3,
        "skills": weights.skills if weights else 0.5,
        "experience": weights.experience if weights else 0.2
    }

    # 🔥 Store job metadata in Redis for workers
    job_cache_data = {
        "job_embedding": job_embedding,
        "required_skills": required_skills,
        "min_experience": min_experience,
        "weights": weights
    }

    redis_client.set(
        f"job:{job_id}",
        json.dumps(job_cache_data)
    )

    return {
        "required_skills": required_skills,
        "min_experience": min_experience,
        "job_embedding": job_embedding,
        "weights": weights
    }