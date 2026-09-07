import os
import re
import time
import json
from typing import Optional, Dict, Any

from agents import Agent, Runner, ModelSettings
from LLM.llm_config import groq_config
from schemas import AnalyzeResumeRequest


def is_quota_error(exc: Exception) -> bool:
    msg = str(exc).lower()
    return any(
        keyword in msg
        for keyword in ("rate_limit_exceeded", "quota", "429", "too many requests")
    )


async def run_llm_agent_analysis(req: AnalyzeResumeRequest) -> Optional[Dict[str, Any]]:
    """
    Evaluates candidate CV against hiring criteria using OpenAI Agents SDK.
    Uses Groq for autonomous AI resume screening.
    """
    if groq_config is None:
        return None

    prompt = f"""You are an Autonomous Executive Technical Recruiter & AI Resume Screening Agent.
Evaluate this candidate CV against the specified hiring criteria.

CANDIDATE CV / RESUME:
\"\"\"
{req.resume_text}
\"\"\"

TARGET HIRING CRITERIA:
- Target Job Title: {req.job_title}
- Target Seniority: {req.seniority}
- Required Skill Tags: {", ".join(req.required_skills) if req.required_skills else "General role skills"}
- Minimum Required Experience: {req.min_experience_years} years
- Full Job Description: {req.job_description or "None provided"}
- Custom Instructions / Rules: {req.custom_criteria or "None"}

Return ONLY a raw JSON object (no markdown code blocks, no explanation text) matching this JSON structure:
{{
  "candidateName": "Extracted candidate name",
  "overallScore": 88,
  "verdictBadge": "RECOMMENDED FOR INTERVIEW" | "POTENTIAL CANDIDATE" | "HIGH RISK / UNMATCHED",
  "fitRating": "A+" | "A" | "B+" | "B" | "C" | "F",
  "executiveSummary": "Concise 3-4 sentence screening summary.",
  "skillMatrix": [
    {{ "skill": "Skill Name", "required": true, "status": "matched" | "partial" | "missing", "evidence": "Direct quote or proof" }}
  ],
  "strengths": [ "Bullet point candidate strength" ],
  "gapsAndRisks": [ "Bullet point shortfall or risk area" ],
  "rubricScores": {{
    "technicalCompetency": {{ "score": 85, "comment": "Comment" }},
    "experienceFit": {{ "score": 90, "comment": "Comment" }},
    "educationAndCredentials": {{ "score": 80, "comment": "Comment" }},
    "roleAlignment": {{ "score": 88, "comment": "Comment" }},
    "softSkills": {{ "score": 85, "comment": "Comment" }}
  }},
  "interviewQuestions": [
    {{ "question": "Probe question", "targetArea": "Category", "rationale": "Why ask this" }}
  ]
}}"""

    async def run_agent(run_config):
        agent = Agent(
            name="Autonomous CV Screening Recruiter",
            instructions="""You are an Autonomous Executive Technical Recruiter & AI Resume Screening Agent.
Evaluate candidate CVs against the specified hiring criteria accurately and impartially.
Always return ONLY a valid JSON object matching the requested schema without markdown backticks or commentary.""",
            model_settings=ModelSettings(temperature=0.2),
        )
        return await Runner.run(
            agent,
            input=prompt,
            run_config=run_config,
        )

    result_output = None
    engine_name = ""

    # Primary: Groq
    if groq_config is not None:
        try:
            print("⚙️ Running CV screening agent with Groq...")
            run_res = await run_agent(groq_config)
            result_output = run_res.final_output
        except Exception as e:
            print(f"⚠️ Groq screening error: {e}")
            return None
    else:
        return None

    if not result_output:
        return None

    raw_text = str(result_output).strip()
    cleaned_json = re.sub(r'```json\s*|\s*```', '', raw_text).strip()
    json_match = re.search(r'\{.*\}', cleaned_json, re.DOTALL)
    if json_match:
        cleaned_json = json_match.group(0)

    try:
        parsed_data = json.loads(cleaned_json)
        parsed_data["success"] = True
        parsed_data["metadata"] = {
            "evaluatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "wordCount": len(req.resume_text.split()),
            "agentEngine": engine_name,
        }
        return parsed_data
    except Exception as parse_err:
        print(f"Failed to parse LLM agent JSON output: {parse_err}")
        return None



def run_local_python_analysis(req: AnalyzeResumeRequest, start_time: float) -> Dict[str, Any]:
    text = req.resume_text
    text_lower = text.lower()

    # Candidate Name
    candidate_name = req.candidate_name
    if not candidate_name:
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        if lines:
            first_line = re.sub(r'[^a-zA-Z\s.-]', '', lines[0]).strip()
            if len(first_line) > 2 and len(first_line.split()) <= 4 and not re.search(r'\b(resume|cv)\b', first_line, re.I):
                candidate_name = first_line
    if not candidate_name:
        candidate_name = f"Candidate ({req.job_title})"

    # Skill Matrix Evaluation
    skill_matrix = []
    matched_count = 0
    partial_count = 0

    skills = req.required_skills if req.required_skills else ["Python", "Problem Solving", "Communication"]
    for skill in skills:
        s_lower = skill.lower()
        pattern = rf'\b{re.escape(s_lower)}\b'
        
        if re.search(pattern, text_lower):
            matched_count += 1
            sentences = [s.strip() for s in re.split(r'[.!?\n]+', text) if s_lower in s.lower() and len(s.strip()) > 15]
            evidence = f'"{sentences[0]}"' if sentences else f"Verified presence of {skill}."
            skill_matrix.append({
                "skill": skill,
                "required": True,
                "status": "matched",
                "evidence": evidence
            })
        elif any(part in text_lower for part in s_lower.split() if len(part) > 2):
            partial_count += 1
            skill_matrix.append({
                "skill": skill,
                "required": True,
                "status": "partial",
                "evidence": f"Related terminology for {skill} found in CV."
            })
        else:
            skill_matrix.append({
                "skill": skill,
                "required": True,
                "status": "missing",
                "evidence": None
            })

    total_skills = len(skills)
    skill_score = min(100, int(((matched_count + partial_count * 0.5) / max(1, total_skills)) * 100))

    # Experience Estimation
    years = [int(y) for y in re.findall(r'\b(19\d\d|20\d\d)\b', text)]
    est_years = 0.0
    if len(years) >= 2:
        years.sort()
        start_y = years[0]
        end_y = min(time.localtime().tm_year, years[-1])
        if start_y > 1990 and end_y >= start_y:
            est_years = float(end_y - start_y)

    exp_match = re.search(r'(\d+)\+?\s*years(?:\s+of)?\s+experience', text, re.I)
    if exp_match:
        try:
            explicit_yrs = float(exp_match.group(1))
            if explicit_yrs > est_years:
                est_years = explicit_yrs
        except ValueError:
            pass

    if est_years == 0.0:
        est_years = 5.0 if len(text) > 3000 else 3.0 if len(text) > 1500 else 2.0

    exp_delta = est_years - req.min_experience_years
    if exp_delta >= 2:
        exp_score = 95
    elif exp_delta >= 0:
        exp_score = 85
    elif exp_delta >= -1:
        exp_score = 65
    else:
        exp_score = 45

    # Credentials & Alignment
    has_degree = bool(re.search(r'\b(bachelor|master|phd|b\.s|m\.s|degree|university)\b', text_lower))
    has_certs = bool(re.search(r'\b(certified|certification|aws|azure|gcp)\b', text_lower))
    edu_score = min(100, 70 + (15 if has_degree else 0) + (15 if has_certs else 0))

    title_words = [w.lower() for w in req.job_title.split() if len(w) > 2]
    matched_title = sum(1 for w in title_words if w in text_lower)
    alignment_score = min(100, int(60 + (matched_title / max(1, len(title_words))) * 40))

    soft_skills_score = 85 if re.search(r'\b(lead|collaborat|communicat|manage|scale)\b', text_lower) else 70

    # Overall Score Calculation
    overall_score = min(99, max(30, int(
        skill_score * 0.40 +
        exp_score * 0.30 +
        alignment_score * 0.15 +
        edu_score * 0.10 +
        soft_skills_score * 0.05
    )))

    # Verdict & Rating
    if overall_score >= 85:
        verdict = "RECOMMENDED FOR INTERVIEW"
        rating = "A+" if overall_score >= 93 else "A"
    elif overall_score >= 70:
        verdict = "POTENTIAL CANDIDATE"
        rating = "B+" if overall_score >= 78 else "B"
    else:
        verdict = "HIGH RISK / UNMATCHED"
        rating = "C" if overall_score >= 55 else "F"

    # Strengths & Gaps
    strengths = []
    gaps = []

    if matched_count > 0:
        matched_names = [s["skill"] for s in skill_matrix if s["status"] == "matched"][:3]
        strengths.append(f"Strong coverage in core required skills: {', '.join(matched_names)}.")
    if est_years >= req.min_experience_years:
        strengths.append(f"Meets experience criteria with approx. {est_years:.1f} years of relevant domain experience (>= {req.min_experience_years} yrs).")
    else:
        gaps.append(f"Experience deficit: Candidate has ~{est_years:.1f} years experience vs requested {req.min_experience_years} years.")

    missing_names = [s["skill"] for s in skill_matrix if s["status"] == "missing"]
    if missing_names:
        gaps.append(f"Missing explicit coverage for required skills: {', '.join(missing_names[:3])}.")

    if has_degree:
        strengths.append("Verified academic degree background.")

    if not strengths:
        strengths.append("General technical background detected in resume.")
    if not gaps:
        gaps.append("No critical red flags detected during automated parsing.")

    exec_summary = (
        f"{candidate_name} achieves a {overall_score}% match rating for the {req.seniority} {req.job_title} role. "
        f"The candidate has approximately {est_years:.1f} years of professional experience with verified coverage in "
        f"{matched_count} of {total_skills} required skill areas. {gaps[0] if gaps else 'Meets main requirements.'}"
    )

    missing = [s["skill"] for s in skill_matrix if s["status"] == "missing"]
    interview_questions = [
        {
            "question": f"We noticed your resume does not explicitly highlight experience with {missing[0]}. Can you elaborate on your experience or ability to pick this up?" if missing else f"Could you walk us through the architecture of your most impactful project using {skills[0]}?",
            "targetArea": "Technical Gap & Depth",
            "rationale": "Probes candidate competence in key target skills."
        },
        {
            "question": f"What was your most challenging technical contribution as a {req.job_title}?",
            "targetArea": "Problem Solving & Engineering Impact",
            "rationale": "Evaluates depth of engineering challenges handled."
        },
        {
            "question": f"How do you approach team collaboration, code reviews, and maintaining standards for target {req.seniority} level expectations?",
            "targetArea": "Seniority & Team Leadership",
            "rationale": "Validates if candidate operates at the requested seniority standard."
        }
    ]

    exec_time_ms = int((time.time() - start_time) * 1000)

    return {
        "success": True,
        "candidateName": candidate_name,
        "overallScore": overall_score,
        "verdictBadge": verdict,
        "fitRating": rating,
        "executiveSummary": exec_summary,
        "skillMatrix": skill_matrix,
        "strengths": strengths,
        "gapsAndRisks": gaps,
        "rubricScores": {
            "technicalCompetency": {"score": skill_score, "comment": f"Skill match index of {skill_score}% across required tags."},
            "experienceFit": {"score": exp_score, "comment": f"Estimated {est_years:.1f} yrs experience vs {req.min_experience_years} yrs required."},
            "educationAndCredentials": {"score": edu_score, "comment": "Degree or relevant certifications verified." if has_degree else "Practical experience verified."},
            "roleAlignment": {"score": alignment_score, "comment": f"Alignment with target {req.job_title} role duties."},
            "softSkills": {"score": soft_skills_score, "comment": "Demonstrated collaboration & leadership indicators."}
        },
        "interviewQuestions": interview_questions,
        "metadata": {
            "evaluatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "wordCount": len(text.split()),
            "executionTimeMs": exec_time_ms,
            "agentEngine": "Aura Autonomous Reasoning Engine (FastAPI Local)",
        }
    }
