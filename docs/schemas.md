# 1️⃣ Overview

This system uses:

* **MongoDB** → Structured application data
* **Pinecone** → Vector embeddings storage
* **Redis** → Queue + Pub/Sub (no persistent data)

Embeddings are NOT stored in MongoDB.

---

# 2️⃣ MongoDB Collections

---

# 📌 Collection: `jobs`

Stores job metadata and processing status.

```json
{
  "_id": ObjectId,
  "title": "Backend Developer",
  "description": "We are looking for a Python backend developer...",
  
  "required_skills": [
    "Python",
    "MongoDB",
    "Redis",
    "REST APIs"
  ],

  "experience_required": 3,

  "status": "Processing", 
  // Draft | Processing | Completed

  "total_resumes": 120,
  "processed_resumes": 85,

  "created_at": ISODate,
  "updated_at": ISODate
}
```

### Notes:

* No embedding stored here.
* Embedding stored in Pinecone with id: `job_{_id}`

---

# 📌 Collection: `resumes`

Stores resume metadata, computed scores, and AI explanation.

```json
{
  "_id": ObjectId,
  "job_id": ObjectId,

  "candidate_name": "Jane Doe",
  "email": "jane@example.com",

  "file": {
    "filename": "jane_doe.pdf",
    "source": "ZIP", 
    "drive_url": "https://drive.google.com/...",
    "uploaded_at": ISODate
  },

  "scores": {
    "similarity_score": 0.78,
    "skills_score": 0.82,
    "experience_score": 0.75,
    "final_score": 83,
    "rank": 1
  },

  "matched_skills": [
    "Python",
    "MongoDB"
  ],

  "missing_skills": [
    "Redis"
  ],

  "experience": {
    "candidate_years": 2,
    "required_years": 3,
    "gap": -1
  },

  "ai_explanation": {
    "strengths": [
      "Strong backend development experience in Python",
      "Good understanding of MongoDB and REST APIs"
    ],
    "weaknesses": [
      "Slightly below required experience level",
      "Limited exposure to Redis"
    ],
    "overall_summary": "Candidate demonstrates strong backend capabilities and aligns well with core requirements but falls slightly short on experience."
  },

  "status": "Completed",
  // Queued | Processing | Completed | Failed

  "processing": {
    "queued_at": ISODate,
    "started_at": ISODate,
    "completed_at": ISODate
  },

  "created_at": ISODate,
  "updated_at": ISODate
}
```

---

# 🔥 Important Design Decisions

### 1️⃣ AI Explanation is Generated Once

* Generated during resume processing
* Stored permanently
* Not regenerated unless resume is reprocessed

---

### 2️⃣ Ranking is Static Per Job

* `final_score` calculated once
* `rank` assigned after all resumes processed
* No live recomputation

---

### 3️⃣ Embeddings Are NOT Stored Here

MongoDB only stores:

* Scores
* Explanation
* Structured metadata

Vectors are stored in Pinecone.

---

# 3️⃣ Pinecone Index Schema

## 📌 Index Name

```
resume-ranking-index
```

## Vector Dimension

Depends on embedding model (e.g., 1536 for OpenAI)

---

## 🔹 Job Embedding Record

```json
{
  "id": "job_<job_id>",
  "values": [0.0123, 0.4567, ...],
  "metadata": {
    "type": "job"
  }
}
```

---

## 🔹 Resume Embedding Record

```json
{
  "id": "resume_<resume_id>",
  "values": [0.2345, 0.9876, ...],
  "metadata": {
    "type": "resume",
    "job_id": "<job_id>"
  }
}
```

---

# 4️⃣ Ranking Logic Flow

When resume is processed:

1. Generate resume embedding
2. Fetch job embedding from Pinecone
3. Compute similarity score
4. Compute:

   * skills_score
   * experience_score
5. Calculate final_score
6. Generate AI explanation
7. Store everything in MongoDB
8. Update rank (after batch complete)

---

# 5️⃣ Indexes (MongoDB Optimization)

## For `resumes` collection:

```javascript
db.resumes.createIndex({ job_id: 1 })
db.resumes.createIndex({ job_id: 1, "scores.final_score": -1 })
db.resumes.createIndex({ status: 1 })
```

## For `jobs` collection:

```javascript
db.jobs.createIndex({ status: 1 })
db.jobs.createIndex({ created_at: -1 })
```

---

# 6️⃣ Final Architecture Summary

| Component | Responsibility                        |
| --------- | ------------------------------------- |
| MongoDB   | Structured data, scores, explanations |
| Pinecone  | Vector storage + similarity           |
| Redis     | Queue + events                        |
| Worker    | Processing + scoring + AI explanation |
| API       | CRUD + ranking retrieval              |

---

# 🚀 Your System Now Supports

* Async resume processing
* Vector-based similarity
* Skill-based scoring
* Experience-based scoring
* AI explainability
* Static ranking
* Historical records

---
