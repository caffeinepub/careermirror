# CareerMirror

## Current State
The project has a frontend scaffolding (React + Tailwind + shadcn/ui) but no App component, no backend Motoko code, and no application logic. The previous build attempt failed.

## Requested Changes (Diff)

### Add
- Student profile management: name, year, department, career goals
- Interest tracking: students can log and update their career interests across domains (software, data science, design, research, management, hardware)
- Career Readiness Index (CRI): a computed score based on skills, activities, and engagement
- Skills tracking: students can add/update skills with proficiency levels
- Learning roadmap: semester-wise recommended courses and resources per career domain
- Activity log: students can log hackathons, workshops, projects, competitions attended
- Mock interview practice: Q&A interface for technical and behavioral interview prep
- Dashboard: visual overview of CRI score, skills, interests, activity count, semester progress
- Role-based views: Student view (personal dashboard) and Admin/Faculty view (overview of student cohort stats)
- Placement goals: track placement vs higher studies vs entrepreneurship path

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend (Motoko):
   - Student profile type with interests, skills, activities, goals, semester
   - CRUD for student profiles
   - Interest domain enum and interest log per student
   - Skills with proficiency level
   - Activity log entries (type, name, date, description)
   - Career Readiness Index computation (weighted formula)
   - Mock interview Q&A bank by domain
   - Admin query: list all students with CRI scores

2. Frontend:
   - Landing/login page with role selection (Student / Admin)
   - Student dashboard: CRI gauge, interest chart, recent activities
   - Profile setup/edit page
   - Interests page: select and track domains
   - Skills page: add/edit skills with proficiency
   - Activities page: log events and competitions
   - Learning Roadmap page: semester-wise resources per domain
   - Mock Interview page: practice Q&A with scoring
   - Admin dashboard: cohort overview table with CRI scores
   - Navigation sidebar
