# services/scoring.py

from sklearn.metrics.pairwise import cosine_similarity

def compute_semantic_score(job_embedding, resume_embedding):
    return float(
        cosine_similarity(
            [job_embedding],
            [resume_embedding]
        )[0][0]
    )

def compute_experience_score(min_exp, resume_exp):
    if min_exp == 0:
        return 1.0
    return min(resume_exp / min_exp, 1.0)

def compute_final_score(
    semantic_score,
    skills_score,
    experience_score,
    weights
):
    final = (
        semantic_score * weights.get("semantic", 0.3) +
        skills_score * weights.get("skills", 0.5) +
        experience_score * weights.get("experience", 0.2)
    )

    return round(final * 100, 2)