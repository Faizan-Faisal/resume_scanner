# 9️⃣ Security Considerations

## 9.1 Overview

Since resumes contain personally identifiable information (PII), strong security measures are implemented to protect user data and ensure compliance with data protection standards.

---

## 9.2 Authentication and Authorization

Authentication is implemented using JWT tokens.

Security measures include:

* Secure password hashing (e.g., bcrypt)
* Token expiration and refresh strategy
* Role-based access control (RBAC)

Only authorized HR users can:

* Create job postings
* View resumes
* Access ranking dashboards

Unauthorized access is strictly restricted.

---

## 9.3 Data Encryption

### In Transit

* All communication is secured via HTTPS (TLS encryption).
* WebSocket connections use secure WSS protocol.

### At Rest

* Resume files are stored securely.
* Database encryption is enabled.
* Sensitive fields may be encrypted at the application level if required.

This prevents unauthorized data exposure.

---

## 9.4 Resume File Protection

Since resumes contain sensitive data:

* File upload validation prevents malicious files.
* File size limits prevent abuse.
* Stored files are isolated from public access.
* Access to resume files requires authentication.

---

## 9.5 Data Privacy Compliance

The system is designed to align with privacy standards such as:

* GDPR principles
* Data minimization
* User consent management
* Right-to-delete functionality

Users can request deletion of stored resumes.

---

## 9.6 WebSocket Security

* JWT validation before connection establishment.
* Authorization check for job access.
* Filtering events based on job_id.

This ensures real-time updates are secure.

---

## 9.7 Security Summary

Security is implemented across:

* Authentication
* Authorization
* Data encryption
* File protection
* Real-time communication
* Privacy compliance

This ensures protection of sensitive candidate data.

---
