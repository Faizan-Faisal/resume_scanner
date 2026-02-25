# 7️⃣ AI & Algorithm Design

## 7.1 Overview

The AI layer of the system is responsible for:

* Converting resumes and job descriptions into numerical representations
* Measuring semantic similarity
* Computing weighted relevance scores
* Ranking candidates objectively
* Providing explainable insights

The system uses a **semantic embedding-based ranking approach** rather than traditional keyword matching.

---

# 7.2 Embedding Model Selection

The system uses a pre-trained transformer-based embedding model to convert text into high-dimensional vectors.

## Why Embeddings?

Traditional keyword matching fails because:

* Candidates may use different wording
* Skills may be implied
* Synonyms are ignored

Embeddings solve this by:

* Capturing semantic meaning
* Understanding contextual similarity
* Handling paraphrased skills

Each text input (resume section or job description) is converted into a dense vector of fixed dimension.

---

## 7.2.1 Resume Processing for Embeddings

Resumes are divided into logical sections:

* Skills
* Experience
* Education

Each section is embedded separately to allow fine-grained scoring.

This enables the system to evaluate:

* Skill match independently
* Experience match independently
* Education match independently

---

# 7.3 Similarity Metric

The system uses **Cosine Similarity** to measure similarity between embeddings.

## Why Cosine Similarity?

Cosine similarity measures the angle between two vectors.

It evaluates similarity based on direction, not magnitude.

This makes it ideal for semantic text comparison.

---

## Cosine Similarity Formula

Cosine Similarity =

(A · B) / (||A|| × ||B||)

Where:

* A = Job embedding
* B = Resume embedding
* · = Dot product
* ||A|| = Magnitude of vector A

The result is between:

* 1 → Perfect match
* 0 → No similarity
* -1 → Opposite meaning

In practice, resume similarity scores fall between 0 and 1.

---

# 7.4 Section-Level Matching Strategy

Instead of generating one single embedding per resume, the system computes similarity per section.

For example:

Skill Similarity = Cosine(Job_Skill_Embedding, Resume_Skill_Embedding)

Experience Similarity = Cosine(Job_Experience_Embedding, Resume_Experience_Embedding)

Education Similarity = Cosine(Job_Education_Embedding, Resume_Education_Embedding)

This allows more controlled and interpretable scoring.

---

# 7.5 Weighted Scoring Algorithm

After computing similarity scores per section, the system calculates the final score using a weighted aggregation.

## Final Score Formula

Final Score =

(Skill Match × W₁) +
(Experience Match × W₂) +
(Education Match × W₃)

Example configuration:

Final Score =
(Skill × 0.5) +
(Experience × 0.3) +
(Education × 0.2)

---

## Why Weighted Scoring?

Different job roles prioritize different aspects:

* Senior Engineer → Experience weighted higher
* Entry-level job → Education weighted higher
* Technical role → Skill weighted highest

Weights are stored per job and dynamically applied during scoring.

This provides flexibility and customization.

---

# 7.6 Score Normalization

Since cosine similarity ranges between 0 and 1, the final score is normalized to a 0–100 scale for easier interpretation:

Final Score (0–100) = Weighted Score × 100

This allows HR users to understand ranking more intuitively.

---

# 7.7 Threshold Logic

To prevent weak matches from appearing in rankings, a minimum similarity threshold is applied.

Example:

If Final Score < 0.4
→ Resume marked as “Low Match”
→ May be excluded from top ranking

Threshold logic improves ranking quality and reduces noise.

---

# 7.8 Ranking Algorithm

Once scores are computed:

1. Only resumes with status = Completed are considered.
2. Resumes are sorted in descending order of final_score.
3. Top N candidates are returned.

Ranking is dynamic — as soon as a resume finishes processing, it is inserted into the ranking automatically.

---

# 7.9 Explainability Logic

To improve transparency, the system extracts:

* Highest similarity sections
* Strongest matched keywords
* Most relevant resume segments

Example explanation output:

* Strong alignment in Python backend development
* Moderate similarity in cloud infrastructure
* Limited experience in DevOps tools

This improves trust and usability.

---

# 7.10 Algorithmic Complexity Consideration

Let:

* N = number of resumes
* D = embedding dimension

Vector similarity search is optimized using vector indexing techniques, reducing complexity from O(N) linear scan to approximate nearest neighbor search.

This ensures scalability to large datasets.

---
