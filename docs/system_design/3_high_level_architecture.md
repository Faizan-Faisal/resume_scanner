## High-Level Architecture

## 3.1 Architectural Overview

The Resume Intelligence Engine follows a **modular, event-driven client-server architecture** designed for scalability, responsiveness, and maintainability.

The system separates:

* Presentation Layer
* API Orchestration Layer
* Asynchronous Processing Layer
* AI Processing Layer
* Data Storage Layer

This separation ensures that compute-intensive AI operations (parsing, embedding generation, similarity scoring) do not block user interactions and can scale independently.

The architecture is inspired by document retrieval systems (similar to RAG pipelines), where resumes act as indexed documents and job descriptions act as semantic queries.

---

## 3.2 Core Architectural Layers

---

## 1️⃣ Presentation Layer (Frontend – React)

Responsible for:

* HR authentication
* Resume uploads
* Job creation & weight configuration
* Monitoring processing status
* Viewing ranked candidates automatically through web sockets
* Viewing score breakdown & explanations

The frontend communicates with the backend through REST APIs and periodically polls for ranking updates.

This layer contains no AI logic and remains purely presentational.

---

## 2️⃣ API Orchestration Layer (FastAPI Backend)

This layer acts as the system coordinator.

Responsibilities:

* Authentication (JWT-based)
* File validation and storage
* Creating processing tasks
* Managing job configuration
* Returning ranking results
* Exposing RESTful endpoints

Important architectural decision:

The API layer does **not** perform heavy AI processing directly.
Instead, it delegates compute-intensive operations to the asynchronous processing layer.

This ensures:

* Non-blocking APIs
* High responsiveness
* Horizontal scalability

---

## 3️⃣ Asynchronous Processing Layer (Task Queue + Worker Pool)

To handle large volumes of resumes efficiently, the system uses asynchronous task processing.

When resumes are uploaded:

1. The backend stores the file.
2. A background task is created per resume.
3. Worker processes independently handle:

   * Resume parsing
   * Text preprocessing
   * Embedding generation
   * Similarity computation
   * Score storage

This design ensures:

* Resume-level parallelism
* Progressive ranking updates
* No waiting for batch completion
* Improved throughput

The system processes resumes in a pipeline:

Resume Extracted → Embedded → Scored → Stored

Each resume is processed independently without blocking others.

---

## 4️⃣ AI Processing Layer

This layer contains the core intelligence of the system.

### Resume Parsing Module

* Extracts text from PDF/DOCX
* Cleans and normalizes content
* Identifies relevant sections

### Embedding Service

* Converts text into vector representations
* Applies chunking strategy
* Generates embeddings for:

  * Resume sections
  * Job descriptions

### Matching & Scoring Engine

* Computes cosine similarity
* Applies weighted scoring
* Normalizes final scores
* Generates ranked candidate lists

### Explanation Engine

* Identifies top-matching resume segments
* Provides score breakdown
* Enhances transparency

Separating AI processing from API logic improves modularity and makes future model upgrades easier.

---

## 5️⃣ Data Storage Layer

The system uses two types of storage:

### Database (Metadata Storage)

Stores:

* Users
* Jobs
* Resume metadata
* Scoring results
* Weight configurations
* Processing status

Optimized for structured queries and reporting.

---

### Vector Database (Embedding Storage)

Stores:

* Resume embeddings
* Job description embeddings

Optimized for:

* Fast similarity search
* Approximate nearest neighbor queries
* High-dimensional vector indexing

Separating vector storage from relational data ensures:

* Better performance
* Independent scaling
* Cleaner data organization

---

## 3.3 End-to-End Data Flow

1. HR uploads resumes.
2. Backend validates and stores files.
3. A background task is created per resume.
4. Worker parses resume text.
5. Embeddings are generated and stored.
6. Job description embedding is generated.
7. Similarity search is executed.
8. Weighted scoring is applied.
9. Results are stored in relational database.
10. Frontend retrieves updated ranking.

The ranking list updates progressively as each resume completes processing.

---

## 3.4 Architectural Rationale (Why This Design)

### 1️⃣ Separation of Concerns

Each layer has a clearly defined responsibility:

* UI logic
* API orchestration
* Background processing
* AI logic
* Data storage

This improves maintainability and extensibility.

---

### 2️⃣ Scalability

* Backend is stateless.
* Worker pool can scale horizontally.
* Vector database can scale independently.

This allows the system to handle increasing resume volumes.

---

### 3️⃣ Responsiveness

Asynchronous processing prevents blocking and ensures the HR dashboard remains responsive even under heavy loads.

---

### 4️⃣ Modularity

Embedding models or scoring algorithms can be replaced without affecting other components.

---

### 5️⃣ Reliability

Failure in processing one resume does not impact other resumes due to task-level isolation.

---

## 3.5 Architectural Benefits

* AI-driven semantic matching
* Progressive real-time ranking updates
* Scalable background processing
* Clear separation between AI and business logic
* Production-style system design
