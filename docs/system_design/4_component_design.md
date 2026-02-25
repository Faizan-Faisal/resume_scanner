# 4️⃣ Component Design

This section describes the internal design of each major system component and how they operate independently while collaborating within the overall architecture.

---

## 4.1 Authentication & User Management Component

### Responsibility

Handles user authentication and access control.

### Key Functions

* User registration
* User login
* JWT token generation
* Token validation middleware
* Role-based authorization (HR-only access)

### Input

* Email
* Password

### Output

* JWT access token
* User session validation

### Design Rationale

Authentication logic is isolated to prevent security concerns from mixing with AI logic. This improves modularity and security management.

---

## 4.2 Resume Upload & File Handling Component

### Responsibility

Handles resume file validation and storage.

### Key Functions

* Accept PDF/DOCX files
* Validate file type and size
* Store file securely
* Generate unique file identifiers
* Trigger asynchronous processing task

### Input

* Resume file
* Associated job ID

### Output

* File storage confirmation
* Task creation acknowledgment

### Design Rationale

File handling is separated from parsing to allow independent validation, storage optimization, and easier scaling of processing pipelines.

---

## 4.3 Asynchronous Task Management Component

### Responsibility

Manages background processing of resumes.

### Key Functions

* Create task per resume
* Queue task for processing
* Track processing status
* Retry failed tasks
* Update processing state in database

### Processing Model

Each resume is processed independently:

Resume Uploaded → Task Created → Worker Picks Task → Processed → Status Updated

### Output

* Processing status (Pending / Processing / Completed / Failed)

### Design Rationale

This component ensures:

* Non-blocking APIs
* Parallel resume processing
* Fault isolation (failure of one resume doesn’t stop others)

---

## 4.4 Resume Parsing Component

### Responsibility

Extracts structured textual data from resumes.

### Key Functions

* PDF/DOCX text extraction
* Text cleaning
* Removal of formatting noise
* Section detection (Skills, Experience, Education)
* Basic keyword tagging

### Input

* Resume file path

### Output

* Cleaned structured text

### Design Rationale

Parsing is isolated so improvements (e.g., better section detection) can be implemented without modifying embedding or scoring logic.

---

## 4.5 Embedding Generation Component

### Responsibility

Converts textual data into vector representations.

### Key Functions

* Chunk long resumes
* Generate embeddings per chunk
* Generate job description embedding
* Store embeddings in vector database

### Input

* Resume text
* Job description text

### Output

* High-dimensional vector representations

### Design Rationale

Embeddings enable semantic matching instead of keyword-based matching.
Separating this logic allows model upgrades without affecting business logic.

---

## 4.6 Vector Search Component

### Responsibility

Performs similarity search between job embeddings and resume embeddings.

### Key Functions

* Retrieve job embedding
* Perform cosine similarity search
* Retrieve top matching resume chunks
* Return similarity scores

### Input

* Job embedding
* Resume embeddings

### Output

* Similarity score per resume
* Top matched segments

### Design Rationale

Vector search is isolated for performance optimization and scalability. It allows use of specialized vector indexing techniques.

---

## 4.7 Weighted Scoring Engine

### Responsibility

Computes final candidate ranking score.

### Key Functions

* Aggregate similarity scores
* Apply job-specific weight configuration
* Normalize final score
* Generate ranking order

### Example Formula

Final Score =
(Skill Similarity × Weight₁) +
(Experience Similarity × Weight₂) +
(Education Similarity × Weight₃)

### Input

* Similarity metrics
* Weight configuration

### Output

* Final candidate score (0–100)

### Design Rationale

Weighted scoring provides flexibility for different job roles and allows HR customization.

---

## 4.8 Explanation Engine

### Responsibility

Provides transparency in scoring.

### Key Functions

* Identify highest similarity resume chunks
* Highlight matched skills
* Provide score breakdown
* Generate human-readable explanation

### Output Example

* "Matched strongly on Python backend development."
* "Moderate alignment in cloud deployment experience."
* "Low similarity in required DevOps tools."

### Design Rationale

Transparency increases trust and makes the system more valuable than traditional ATS.

---

## 4.9 Ranking & Result Management Component

### Responsibility

Maintains ranked candidate list.

### Key Functions

* Store computed scores
* Sort candidates by score
* Update ranking progressively as tasks complete
* Serve ranked data to frontend

### Design Rationale

Separating ranking from scoring allows dynamic updates and efficient retrieval.

---

## 4.10 Logging & Monitoring Component

### Responsibility

Tracks system behavior and failures.

### Key Functions

* API logging
* Error logging
* Embedding generation failure tracking
* Performance metrics logging

### Design Rationale

Ensures reliability and easier debugging in production environments.

---
