# Implementation Plan

**Project:** AI Resume Ranking & Scanner System
**Architecture:** Event-Driven with Redis Pub/Sub
**Deployment:** Local Development (No Containerization)
**Google Drive Integration:** Public Shareable Folder (Viewer Access Only)

---

# 1️⃣ Objective

This document defines the structured execution roadmap for implementing the AI-powered resume ranking system.

The system will:

* Accept resumes via ZIP upload or public Google Drive folder
* Process resumes asynchronously
* Compute AI-based ranking scores
* Use Redis Queue for background processing
* Use Redis Pub/Sub for real-time updates
* Push ranking updates via WebSocket

---

# 2️⃣ Architectural Principles

* Asynchronous Processing
* Event-Driven Design
* Real-Time Notifications
* Minimal External Complexity
* Modular Implementation

---

# 3️⃣ Phase 1 – Local Development Setup

## Objective

Prepare local environment and foundational services.

## Tasks

* Initialize backend project
* Setup MongoDB locally
* Setup Redis locally
* Configure environment variables
* Setup logging system
* Setup centralized error handling
* Create separate worker service
* Verify:

  * API server runs
  * Worker process runs
  * MongoDB connection stable
  * Redis connection stable

## Deliverable

✔ API running locally
✔ Worker service operational
✔ MongoDB connected
✔ Redis Queue & Pub/Sub working

---

# 4️⃣ Phase 2 – Resume Scanner Module

Resumes will be provided through:

1. ZIP folder upload
2. Publicly accessible Google Drive folder link

---

## 4.1 ZIP Folder Upload

### Endpoint

```
POST /jobs/{job_id}/resumes/zip
```

### Flow

1. Upload ZIP file
2. Validate file type
3. Extract ZIP contents
4. Identify all PDF files
5. For each PDF:

   * Generate resume_id
   * Insert metadata into MongoDB:

     * job_id
     * filename
     * source = "ZIP"
     * status = "Queued"
     * created_at timestamp
6. Push resume_id to Redis Queue
7. Remove extracted files (cleanup)

### Deliverable

✔ All resumes registered in DB
✔ Status = Queued
✔ Redis Queue populated

---

## 4.2 Google Drive Public Folder Integration

### Design Decision

Only publicly accessible folders are supported.

Folder must be shared as:

> "Anyone with the link → Viewer"

No OAuth or user authentication required.

---

### Endpoint

```
POST /jobs/{job_id}/resumes/gdrive
```

---

### Flow

1. Accept public Google Drive folder URL
2. Extract folder ID from URL
3. Fetch list of files in folder
4. Filter PDF files only
5. Download each PDF temporarily
6. For each file:

   * Generate resume_id
   * Insert metadata into MongoDB:

     * job_id
     * filename
     * source = "GoogleDrive"
     * status = "Queued"
     * created_at timestamp
7. Push resume_id to Redis Queue
8. Delete temporary files

---

### System Assumption

* Folder must be publicly accessible.
* Private or restricted folders are not supported.
* Only PDF and word files are processed.

---

### Deliverable

✔ Resume metadata stored
✔ Status = Queued
✔ Resume IDs pushed to Redis Queue

---

# 5️⃣ Phase 3 – Background Resume Processing Engine

## Objective

Process resumes asynchronously and compute ranking scores.

---

## Worker Responsibilities

Worker continuously:

1. Pull resume_id
2. Fetch resume metadata
3. Fetch job (already structured)
4. Extract resume text
5. Extract resume skills
6. Extract resume experience
7. Generate resume embedding
8. Compute semantic_score 
9. Compute skills_score
10. Compute experience_score
11. Apply weights from job document
12. Update MongoDB

Example:

```json
{
  "status": "Completed",
  "scores": {
    "similarity_score": 0.78,
    "skills_score": 0.82,
    "experience_score": 0.75,
    "final_score": 83
  },
  "processed_at": "timestamp"
}
```

---

## Deliverable

✔ Resume status updated to Completed
✔ Scores stored
✔ Resume eligible for ranking

---

# 6️⃣ Phase 4 – Redis Pub/Sub Event System (Core Feature)

This is the central real-time architecture component.

---

## 6.1 Event Publishing

After worker completes processing:

It publishes event to Redis Pub/Sub.

### Channel

```
resume_completed
```

### Message

```json
{
  "job_id": "456",
  "resume_id": "123",
  "final_score": 83
}
```

---

## 6.2 Backend Subscription

API server:

* Subscribes to `resume_completed`
* Listens for events continuously
* When event received:

  * Identifies WebSocket clients subscribed to job_id
  * Broadcasts update

---

## 6.3 WebSocket Endpoint

```
ws://api/jobs/{job_id}/ranking
```

### Flow

1. HR opens ranking page
2. WebSocket connection established
3. JWT validated
4. Connection stored in memory grouped by job_id
5. When Pub/Sub event received:

   * Server pushes notification

Example message to frontend:

```json
{
  "type": "resume_completed",
  "resume_id": "123"
}
```

---

## Deliverable

✔ Real-time ranking updates
✔ No page refresh required
✔ Event-driven communication active

---

# 7️⃣ Phase 5 – Ranking Engine

### Endpoint

```
GET /jobs/{job_id}/ranking
```

### Logic

* Filter resumes:

  * job_id
  * status = "Completed"
* Sort:

  * final_score DESC
* Add pagination support

---

## Database Indexes

* job_id
* status
* final_score (descending index)

---

## Deliverable

✔ Efficient ranking retrieval
✔ Correct ordering
✔ Pagination support

---

# 8️⃣ Phase 6 – Authentication & Security

* JWT authentication required for all APIs
* JWT validation for WebSocket connection
* Validate job access authorization
* Validate file type (PDF and word only)
* Enforce file size limits

---

# 9️⃣ System Flow Overview

ZIP Upload OR Public GDrive Folder
↓
MongoDB (status = Queued)
↓
Redis Queue
↓
Worker Processing
↓
MongoDB (status = Completed)
↓
Redis Pub/Sub Event
↓
WebSocket Broadcast
↓
Frontend Re-fetch Ranking

---

# 🔟 Assumptions & Constraints

* Google Drive folder must be publicly accessible
* Only PDF and word resumes supported
* Local development environment only
* No containerization at this stage
* No OAuth integration

---

# 1️⃣1️⃣ Definition of Done

System is complete when:

* ZIP upload works
* Public Google Drive integration works
* Resumes processed asynchronously
* Scores stored correctly
* Ranking API works
* Redis Pub/Sub triggers events
* WebSocket updates UI in real time

---

# 🚀 You Now Have a Proper Event-Driven Implementation Plan

This is architecturally strong, technically realistic, and aligned with your current skill level.

---
