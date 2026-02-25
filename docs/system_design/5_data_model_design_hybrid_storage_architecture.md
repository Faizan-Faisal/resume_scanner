# 5️⃣ Data Model Design (Hybrid Storage Architecture)

## Overview

The system uses a **hybrid data storage architecture** to optimize for flexibility, scalability, and performance. Since the application combines traditional CRUD operations with AI-driven vector search and asynchronous processing, a single database solution is insufficient.

The storage layer is divided into three specialized components:

* **MongoDB → Application Data**
* **Redis → Asynchronous Task Queue**
* **Vector Database → Embedding Storage & Similarity Search**

Each technology is chosen based on workload characteristics and performance requirements.

---

# 5.1 MongoDB – Application Data Layer

MongoDB serves as the primary application database. It stores structured and semi-structured business data, including:

* Users (authentication & roles)
* Job descriptions
* Uploaded resumes
* Processing status
* Scoring results
* Explanation metadata

## Why MongoDB?

Resumes and AI scoring results are semi-structured and evolve over time. MongoDB’s document-based schema allows flexible storage of nested fields such as:

* Processing metadata
* Weighted score breakdown
* Explanations
* Embedding references

Unlike relational databases, MongoDB does not require strict schema migrations when adding new AI features or score components. This makes it highly suitable for iterative AI development.

## Design Strategy

* Each resume is stored as a single document.
* Processing state is embedded within the resume document.
* Score breakdown is embedded inside the resume document.
* Ranking queries operate directly on indexed score fields.
* Job-specific weight configurations are stored inside job documents.

This approach eliminates complex joins and improves query performance when retrieving ranked candidate lists.

## Key Advantages

* Flexible schema for AI experimentation
* Efficient ranking queries
* Simplified document updates during asynchronous processing
* Horizontal scalability via sharding

MongoDB acts as the **source of truth for business data**.

---

# 5.2 Redis – Asynchronous Task Queue

Redis is used to manage background resume processing tasks.

When a resume is uploaded:

1. A resume document is created in MongoDB with status = “Pending”.
2. A task payload is pushed to Redis.
3. Worker processes consume tasks independently.
4. Each worker updates the corresponding MongoDB document.

## Why Redis?

Resume parsing, embedding generation, and similarity scoring are computationally intensive operations. Running them synchronously would block API responses.

Redis provides:

* In-memory high-speed task queuing
* Non-blocking API architecture
* Horizontal worker scalability
* Fault isolation per resume

Each resume is processed independently. The system does not wait for all resumes to finish before generating rankings. As soon as one resume completes processing, its score becomes available.

This design ensures:

* Progressive ranking updates
* High throughput
* Better user experience
* Improved system reliability

Redis acts as the **processing orchestrator** between API layer and AI pipeline.

---

# 5.3 Vector Database – Embedding Storage Layer

A dedicated vector database is used to store high-dimensional embeddings generated from:

* Resume text chunks
* Job descriptions

These embeddings enable semantic similarity matching between job requirements and candidate resumes.

## Why a Vector Database?

Traditional databases are not optimized for high-dimensional nearest neighbor search. Vector databases provide:

* Fast cosine similarity search
* Optimized indexing for embeddings
* Sub-second semantic retrieval
* Scalable storage for millions of vectors

## Design Strategy

* Resumes are chunked into logical sections (skills, experience, etc.).
* Each chunk is converted into an embedding.
* Embeddings are stored in the vector database with metadata linking them to:

  * resume_id
  * job_id
* When scoring:

  * The job embedding is queried against resume embeddings.
  * Similarity scores are aggregated per resume.
  * Results are sent to the scoring engine.

The vector database handles **semantic intelligence**, while MongoDB stores structured results.

---

# 5.4 End-to-End Data Flow Across Storage Layers

The data lifecycle across the hybrid model is as follows:

1. Resume uploaded → Stored in MongoDB (status: Pending)
2. Task created → Stored in Redis queue
3. Worker consumes task
4. Resume parsed and cleaned
5. Embeddings generated → Stored in Vector DB
6. Similarity search performed
7. Weighted scoring computed
8. MongoDB resume document updated with:

   * Final score
   * Score breakdown
   * Explanation
   * Status = Completed
9. Ranking endpoint retrieves sorted results from MongoDB

Each resume follows this pipeline independently.

This architecture ensures the system never blocks waiting for batch completion.

---

# 5.5 Data Consistency Strategy

Since the system uses three storage systems, consistency is maintained as follows:

* MongoDB is the authoritative record of processing state.
* Redis only stores transient task data.
* Vector DB stores derived embedding data.
* Resume document contains reference to embeddings.

If embedding generation fails:

* Resume status is marked as Failed.
* Task retry mechanism handles recovery.
* No partial state remains inconsistent.

MongoDB always reflects the true processing lifecycle.

---

# 5.6 Why Hybrid Architecture Is Necessary

A single database cannot efficiently handle:

* Semi-structured resume data
* High-speed asynchronous processing
* High-dimensional vector search

The hybrid approach ensures:

* Scalability
* Performance optimization
* Clear separation of responsibilities
* Independent scaling of AI components
* Non-blocking architecture

This design ensures the system never blocks waiting for batch completion.

---

# Conclusion

The hybrid data model enables the system to:

* Process resumes asynchronously
* Perform semantic similarity search efficiently
* Maintain structured business data
* Scale independently across components
* Provide real-time progressive ranking

MongoDB manages business logic, Redis manages execution flow, and the vector database enables intelligent matching.

This architecture is production-ready and scalable for enterprise-level deployment.

---
