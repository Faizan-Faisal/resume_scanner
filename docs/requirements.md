# Requiremets

---

## Problem Statement
Recruiters receive hundreds of resumes for a single job opening. Manual screening is time-consuming, error-prone, and biased. It becomes the hecktique work..
So the solution we proposed for this, 
This system automates resume screening using AI while allowing HR professionals to define custom evaluation criteria per job assessment.


## Functional Requirements
- HR can create an assessment
- HR can upload/write job description
- HR can define custom weightage per assessment
- HR can upload resumes via folder/drive
The Google Drive folder must be publicly accessible (viewer permission).
- System extracts each resume data
- System ranks resumes using AI (also provides what is extra-edge and what is missing in that resume)
- System provides explainable scoring
- System then provides an excel sheet

## Non-Functional Requirements
- Asynchronous processing
- Scalability for bulk resumes
- Low response time for UI
- Secure document storage
- Explainable and fair AI decisions
