import requests

BASE_URL = "http://127.0.0.1:8000"

sample_cv = """
ALEX RIVERA
Senior Full-Stack Engineer
Email: alex.rivera@example.com | Location: San Francisco, CA

SUMMARY
Experienced Senior Full-Stack Engineer with 10+ years designing scalable cloud services, Next.js web applications, and PostgreSQL databases.

TECHNICAL SKILLS
Python, JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS, REST APIs

EXPERIENCE
Lead Full-Stack Architect | NextGen Talent AI (2021 - Present)
- Designed real-time resume parsing pipeline using Next.js, Node.js and PostgreSQL.

Senior Software Engineer | CloudScale Systems (2017 - 2021)
- Built microservices serving 10M+ daily requests using TypeScript and Docker.

EDUCATION
B.S. in Computer Science | UC Berkeley (2014)
"""

def test_extract():
    print("Testing POST /extract-resume...")
    resp = requests.post(f"{BASE_URL}/extract-resume", data={"raw_text": sample_cv})
    print("Extract Response Status:", resp.status_code)
    data = resp.json()
    print("Candidate Name:", data.get("candidate_name"))
    print("Email:", data.get("email"))
    print("Skills Detected:", data.get("skills"))
    print("Total Exp Years:", data.get("total_experience_years"))
    assert resp.status_code == 200, "Extract failed!"
    print("[OK] Endpoint 1 (/extract-resume) passed!\n")

def test_analyze():
    print("Testing POST /analyze-resume...")
    payload = {
        "resume_text": sample_cv,
        "job_title": "Senior Full-Stack Engineer",
        "seniority": "Senior",
        "required_skills": ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
        "min_experience_years": 5.0,
        "job_description": "Seeking senior engineer for cloud platforms."
    }
    resp = requests.post(f"{BASE_URL}/analyze-resume", json=payload)
    print("Analyze Response Status:", resp.status_code)
    data = resp.json()
    print("Overall Match Score:", data.get("overallScore"))
    print("Verdict Badge:", data.get("verdictBadge"))
    print("Fit Rating:", data.get("fitRating"))
    print("Executive Summary:", data.get("executiveSummary"))
    assert resp.status_code == 200, "Analyze failed!"
    print("[OK] Endpoint 2 (/analyze-resume) passed!\n")

if __name__ == "__main__":
    test_extract()
    test_analyze()
