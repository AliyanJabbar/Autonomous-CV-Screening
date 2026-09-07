import re
import time
from typing import Dict, Any


def parse_resume_structure(text: str) -> Dict[str, Any]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    
    # 1. Candidate Name Extraction
    candidate_name = "Candidate"
    if lines:
        for line in lines[:5]:
            if "@" in line or "http" in line or re.search(r'\.(com|net|org|io|dev|ai)\b', line, re.I):
                continue
            cleaned = re.sub(r'[^a-zA-Z\s.-]', '', line).strip()
            if len(cleaned) > 2 and len(cleaned.split()) <= 4 and not re.search(r'\b(resume|cv|curriculum|profile|email|phone)\b', cleaned, re.I):
                candidate_name = cleaned
                break

    # 2. Email & Phone Extraction
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    email = email_match.group(0) if email_match else None

    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else None

    # 3. Links Extraction
    links = re.findall(r'(https?://[^\s,]+|github\.com/[^\s,]+|linkedin\.com/in/[^\s,]+)', text, re.I)

    # 4. Total Experience Estimation
    years = [int(y) for y in re.findall(r'\b(19\d\d|20\d\d)\b', text)]
    total_exp_years = 0.0
    if len(years) >= 2:
        years.sort()
        start_year = years[0]
        end_year = min(time.localtime().tm_year, years[-1])
        if start_year > 1990 and end_year >= start_year:
            total_exp_years = float(end_year - start_year)

    exp_statement = re.search(r'(\d+)\+?\s*years(?:\s+of)?\s+experience', text, re.I)
    if exp_statement:
        try:
            explicit_yrs = float(exp_statement.group(1))
            if explicit_yrs > total_exp_years:
                total_exp_years = explicit_yrs
        except ValueError:
            pass

    if total_exp_years == 0.0:
        total_exp_years = 5.0 if len(text) > 3000 else 3.0 if len(text) > 1500 else 1.5

    # 5. Skill Keyword Extraction
    common_tech_skills = [
        "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
        "FastAPI", "Django", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes",
        "AWS", "Azure", "GCP", "PyTorch", "TensorFlow", "SQL", "Git", "REST APIs",
        "GraphQL", "CI/CD", "TailwindCSS", "HTML", "CSS", "Microservices"
    ]
    detected_skills = []
    text_lower = text.lower()
    for skill in common_tech_skills:
        pattern = rf'\b{re.escape(skill.lower())}\b'
        if re.search(pattern, text_lower):
            detected_skills.append(skill)

    # 6. Education Extraction
    education_list = []
    edu_matches = re.findall(r'(bachelor|master|phd|b\.s|m\.s|b\.tech|m\.tech|degree|university|college)[^\n,.]*', text, re.I)
    for edu in edu_matches[:3]:
        education_list.append({"degree_summary": edu.strip()})

    # 7. Summary
    summary = lines[1] if len(lines) > 1 and len(lines[1]) > 30 else (text[:250] + "...")

    return {
        "candidate_name": candidate_name,
        "email": email,
        "phone": phone,
        "links": list(set(links)),
        "professional_summary": summary,
        "skills": detected_skills,
        "total_experience_years": total_exp_years,
        "education": education_list,
        "word_count": len(text.split()),
        "raw_text": text,
    }
