import re
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import requests

from schemas import ExtractResumeResponse, LinkExtractRequest
from services.pdf_service import extract_text_from_pdf
from services.parser_service import parse_resume_structure

router = APIRouter(tags=["Extract"])


def normalize_resume_url(url: str) -> str:
    """Normalizes cloud storage links (Google Drive, Dropbox) into direct file download links."""
    url = url.strip()
    # Google Drive view/share links
    gdrive_match = re.search(r'drive\.google\.com/file/d/([a-zA-Z0-9_-]+)', url)
    if gdrive_match:
        return f"https://drive.google.com/uc?export=download&id={gdrive_match.group(1)}"
    
    gdrive_open = re.search(r'drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)', url)
    if gdrive_open:
        return f"https://drive.google.com/uc?export=download&id={gdrive_open.group(1)}"

    # Dropbox viewer links
    if "dropbox.com" in url:
        if "dl=0" in url:
            url = url.replace("dl=0", "dl=1")
        elif "raw=0" in url:
            url = url.replace("raw=0", "raw=1")
        elif "?dl=" not in url and "&dl=" not in url:
            url += ("&dl=1" if "?" in url else "?dl=1")

    return url


@router.post("/extract-resume", response_model=ExtractResumeResponse)
async def extract_resume_file(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    url: Optional[str] = Form(None)
):
    """
    Endpoint 1: Extract Resume Data
    Accepts an uploaded file (PDF, TXT, DOCX), raw text, or web URL and extracts candidate details.
    """
    extracted_text = ""

    if file:
        file_bytes = await file.read()
        file_name = file.filename.lower() if file.filename else ""
        
        if file_name.endswith(".pdf") or file_bytes.startswith(b"%PDF"):
            extracted_text = extract_text_from_pdf(file_bytes)
        else:
            try:
                extracted_text = file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                raise HTTPException(status_code=400, detail="Could not decode file text content.")

    elif url:
        target_url = normalize_resume_url(url)
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        try:
            resp = requests.get(target_url, timeout=15, headers=headers, allow_redirects=True)
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail=f"URL fetch failed with status code {resp.status_code}")
            
            content_type = resp.headers.get("Content-Type", "").lower()
            is_pdf = resp.content.startswith(b"%PDF") or "application/pdf" in content_type or target_url.lower().rsplit('?', 1)[0].endswith(".pdf")

            if is_pdf:
                extracted_text = extract_text_from_pdf(resp.content)
            else:
                extracted_text = resp.text
                # Basic HTML strip if web page
                extracted_text = re.sub(r'<[^>]+>', ' ', extracted_text)
                extracted_text = re.sub(r'\s+', ' ', extracted_text).strip()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error fetching URL: {str(e)}")

    elif raw_text:
        extracted_text = raw_text.strip()

    else:
        raise HTTPException(
            status_code=400,
            detail="Please provide a file upload, raw_text, or url parameter to extract resume data."
        )

    if not extracted_text or len(extracted_text.strip()) < 20:
        raise HTTPException(status_code=422, detail="Extracted resume text is too short or empty.")

    parsed = parse_resume_structure(extracted_text)

    return ExtractResumeResponse(
        success=True,
        candidate_name=parsed["candidate_name"],
        email=parsed["email"],
        phone=parsed["phone"],
        links=parsed["links"],
        professional_summary=parsed["professional_summary"],
        skills=parsed["skills"],
        total_experience_years=parsed["total_experience_years"],
        education=parsed["education"],
        word_count=parsed["word_count"],
        raw_text=parsed["raw_text"]
    )


@router.post("/extract-resume/json", response_model=ExtractResumeResponse)
async def extract_resume_json(body: LinkExtractRequest):
    """
    JSON helper variant for URL / Link extraction
    """
    return await extract_resume_file(file=None, raw_text=None, url=body.url)
