from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class LinkExtractRequest(BaseModel):
    url: str = Field(..., example="https://raw.githubusercontent.com/user/repo/main/cv.txt")


class ExtractResumeResponse(BaseModel):
    success: bool
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    links: List[str] = Field(default_factory=list)
    professional_summary: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    total_experience_years: float = 0.0
    work_experience: List[Dict[str, Any]] = Field(default_factory=list)
    education: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    word_count: int = 0
    raw_text: str = ""


class AnalyzeResumeRequest(BaseModel):
    resume_text: str = Field(..., description="Raw text of candidate's CV/Resume")
    job_title: str = Field(..., description="Target job title", example="Senior Full-Stack Engineer")
    seniority: str = Field(default="Senior", description="Seniority level e.g. Junior, Mid, Senior, Lead")
    required_skills: List[str] = Field(default_factory=list, description="List of required skill tags")
    min_experience_years: float = Field(default=3.0, description="Minimum required years of experience")
    job_description: Optional[str] = Field(default="", description="Full job description text")
    custom_criteria: Optional[str] = Field(default="", description="Custom agent guidelines or rules")
    candidate_name: Optional[str] = Field(default=None, description="Optional override for candidate name")


class SkillMatchItem(BaseModel):
    skill: str
    required: bool = True
    status: str  # "matched" | "partial" | "missing"
    evidence: Optional[str] = None


class RubricCategory(BaseModel):
    score: int
    comment: str


class RubricScores(BaseModel):
    technicalCompetency: RubricCategory
    experienceFit: RubricCategory
    educationAndCredentials: RubricCategory
    roleAlignment: RubricCategory
    softSkills: RubricCategory


class InterviewQuestionItem(BaseModel):
    question: str
    targetArea: str
    rationale: str


class AnalyzeResumeResponse(BaseModel):
    success: bool = True
    candidateName: str
    overallScore: int  # 0 to 100
    verdictBadge: str  # "RECOMMENDED FOR INTERVIEW" | "POTENTIAL CANDIDATE" | "HIGH RISK / UNMATCHED"
    fitRating: str  # "A+" | "A" | "B+" | "B" | "C" | "F"
    executiveSummary: str
    skillMatrix: List[SkillMatchItem]
    strengths: List[str]
    gapsAndRisks: List[str]
    rubricScores: RubricScores
    interviewQuestions: List[InterviewQuestionItem]
    metadata: Dict[str, Any]
