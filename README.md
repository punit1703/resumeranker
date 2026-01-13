
# ATS Resume Ranker & Generator

An ATS-based resume analysis and generation system built using **Django REST Framework** and **React (Vite)**.  
This project simulates how Applicant Tracking Systems (ATS) evaluate resumes against job descriptions and helps users understand skill gaps while generating an ATS-friendly resume.

---

## 🚀 Features

- ATS Score Calculation using weighted, JD-specific skills
- Skill Gap Analysis with improvement suggestions
- Resume Ranking for multiple candidates
- ATS-Friendly Resume Generator (PDF)
- Simple, clean UI focused on functionality
- Production-safe PDF generation using in-memory buffers

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Lucide Icons

### Backend
- Django
- Django REST Framework
- ReportLab (PDF generation)

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 📂 Project Structure
```
project-root/
├── frontend/          # React + Vite frontend
│   ├── src/
│   └── vite.config.js
│
├── backend/           # Django backend
│   ├── ats/
│   │   ├── analysis/
│   │   ├── scoring/
│   │   ├── ranking/
│   │   └── resume_builder/
│   └── manage.py
│
└── README.md
```
---

## ⚙️ How It Works

1. User enters resume details or uploads resume
2. System extracts skills from resume and job description
3. ATS score is calculated using weighted skill matching
4. Missing skills are identified via skill gap analysis
5. Resume can be generated as a clean, ATS-compatible PDF

---

## ▶️ Run Locally

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Important Notes

- Resume formatting is intentionally simple to ensure ATS compatibility
- PDF generation is done in-memory to support cloud deployments
- Phone number and other metadata are optional and do not affect ATS scoring
- This project focuses on logic and backend processing rather than visual resume design

---

## 🎓 Academic Context

This project was built as a **college-level software engineering project** to demonstrate:
- Backend API design
- Real-world problem modeling (ATS systems)
- Frontend-backend integration
- Cloud deployment considerations

---
## 🌐 Live Demo

Frontend (Vercel): 
``` 
https://resumeranker-mu.vercel.app/
```

Backend API (Render):  
```
https://resume-ranker-backend-esei.onrender.com
```

---

## 👨‍💻 Primary Contributor

**Punit Patel**  
Backend development, ATS logic, API design, deployment

---

## 👥 Project Team

- **Purv Patel** — Documentation
- **Om Patel** — UI review,Testing and presentation support

---