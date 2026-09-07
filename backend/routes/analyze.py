import os
import time
from fastapi import APIRouter, HTTPException

from schemas import AnalyzeResumeRequest, AnalyzeResumeResponse
from services.analysis_service import run_gemini_ai_analysis, run_local_python_analysis

router = APIRouter(tags=["Analyze"])


@router.post("/analyze-resume", response_model=AnalyzeResumeResponse)
async def analyze_resume(request: AnalyzeResumeRequest):
    """
    Endpoint 2: Analyze Resume Based on Criteria
    Evaluates candidate's resume text against job requirements, skills, experience thresholds, and criteria.
    Returns multi-factor score, fit rating, verdict, strengths, gaps, rubric scores, and tailored interview questions.
    """
    start_time = time.time()
    
    resume_text = request.resume_text.strip()
    if not resume_text or len(resume_text) < 30:
        raise HTTPException(status_code=400, detail="Resume text is too short to perform criteria evaluation.")

    if not request.job_title.strip():
        raise HTTPException(status_code=400, detail="Target job_title is required.")

    # Check for Gemini AI key
    gemini_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if gemini_api_key:
        try:
            gemini_result = run_gemini_ai_analysis(gemini_api_key, request)
            if gemini_result:
                execution_time = int((time.time() - start_time) * 1000)
                gemini_result["metadata"]["executionTimeMs"] = execution_time
                return AnalyzeResumeResponse(**gemini_result)
        except Exception as e:
            print(f"Gemini API error, falling back to Python local agent engine: {e}")

    # Local Python Intelligent Reasoning Engine Fallback
    local_result = run_local_python_analysis(request, start_time)
    return AnalyzeResumeResponse(**local_result)
