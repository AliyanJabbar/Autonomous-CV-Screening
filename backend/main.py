from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.extract import router as extract_router
from routes.analyze import router as analyze_router

load_dotenv()

app = FastAPI(
    title="Autonomous CV Screening Engine API",
    description="FastAPI Backend for Resume Data Extraction and Autonomous Criteria Analysis",
    version="1.0.0",
)

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(extract_router)
app.include_router(analyze_router)


# ==============================================================================
# ROOT HEALTH CHECK ENDPOINT
# ==============================================================================

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Autonomous CV Screening FastAPI Engine",
        "endpoints": [
            "POST /extract-resume (Extract structured resume data from file/text/url)",
            "POST /extract-resume/json (JSON helper for URL extraction)",
            "POST /analyze-resume (Analyze resume against custom job criteria)"
        ]
    }
