# 6️⃣ Database Design (MongoDB)

## Overview

The system uses **MongoDB as the primary application database**. Since resume data and AI scoring outputs are semi-structured and continuously evolving, a document-based NoSQL database is better suited than a traditional relational database.

MongoDB enables:

* Flexible schema design
* Embedded document structures
* Efficient ranking queries
* Simplified asynchronous updates
* Horizontal scalability

This database acts as the **source of truth for all business-level data**.

---

# 6.1 Design Principles

The MongoDB schema is designed based on the following principles:

### 1️⃣ Document-Centric Modeling

Each major business entity (User, Job, Resume) is stored as a separate collection.

### 2️⃣ Embedding Over Referencing

Closely related data such as:

* Processing state
* Score breakdown
* Explanation metadata

are embedded inside the Resume document to avoid joins and improve read performance.

### 3️⃣ Optimized for Read Queries

The system frequently retrieves ranked resumes for a job.
Therefore, the schema is optimized for:

* Filtering by job_id
* Sorting by final_score
* Filtering by processing.status

---

# 6.2 Collections Design

## 6.2.1 Users Collection

Stores authentication and role information.

Purpose:

* User login
* Role-based access control
* Job ownership tracking

Key Fields:

* email (unique)
* password_hash
* role
* created_at

Design Note:
Unique index is created on `email` to prevent duplicate accounts.

---

## 6.2.2 Jobs Collection

Stores job descriptions and weight configuration.

Purpose:

* Define job requirements
* Store scoring weights
* Link resumes to job

Key Fields:

* title
* description
* weights (skill, experience, education)
* created_by
* created_at

Design Decision:
Weights are stored inside the job document so scoring logic can dynamically adjust per job role without schema change.

---

## 6.2.3 Resumes Collection (Core Collection)

This is the most important collection in the system.

Each resume document represents the full lifecycle of a candidate submission.

It contains:

* File metadata
* Extracted text
* Processing state
* Score breakdown
* Final ranking score
* Explanation details
* Embedding reference

### Embedded Structures

Processing metadata is embedded:

```
processing: {
   status,
   retry_count,
   last_updated
}
```

Scores are embedded:

```
scores: {
   skill_score,
   experience_score,
   education_score,
   final_score
}
```

Explanation is embedded as an array of insights.

---

# 6.3 Why Resume Data Is Embedded

Instead of storing scores in a separate collection, the score is embedded inside the resume document because:

* Score always belongs to one resume
* It is always retrieved with resume
* It simplifies ranking queries
* It avoids unnecessary joins
* It improves read performance

This design supports progressive updates during asynchronous processing.

---

# 6.4 Indexing Strategy

Proper indexing is critical for performance.

The following indexes are used:

### 1️⃣ job_id Index

Improves filtering resumes by job.

### 2️⃣ Compound Index

(job_id + processing.status)
Improves retrieval of completed resumes for ranking.

### 3️⃣ Score Index

Index on scores.final_score (descending)
Optimizes sorting for ranking queries.

### 4️⃣ Email Unique Index (Users)

Ensures authentication integrity.

---

# 6.5 Query Optimization for Ranking

The most frequent query in the system is:

* Fetch all completed resumes for a job
* Sort by final score
* Limit top N candidates

Because score is embedded and indexed, this query is highly efficient and does not require joins.

---

# 6.6 Data Lifecycle in MongoDB

1. Resume document created (status: Pending)
2. Background worker updates status to Processing
3. After AI scoring:

   * scores field updated
   * explanation stored
   * status set to Completed
4. Resume becomes visible in ranking

MongoDB always reflects the current processing state of each resume.

---

# 6.7 Scalability Considerations

MongoDB supports:

* Horizontal scaling via sharding
* High write throughput
* Flexible schema evolution

If resume volume grows to millions:

* Resumes collection can be sharded by job_id
* Indexes ensure efficient filtering
* Workers can update documents independently

This ensures long-term scalability.

---

# 6.8 Why MongoDB Instead of Relational Database

MongoDB was chosen because:

* Resume text is semi-structured
* AI scoring fields may evolve
* Embedded documents simplify reads
* No complex joins required
* Asynchronous updates are frequent
* Horizontal scaling is easier

Relational databases would require:

* Multiple joined tables
* Schema migrations for new AI features
* More complex update logic

MongoDB better aligns with AI-driven workflows.

---
