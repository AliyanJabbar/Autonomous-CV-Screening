import io
from fastapi import HTTPException

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False


def extract_text_from_pdf(file_bytes: bytes) -> str:
    if not PYPDF_AVAILABLE:
        raise HTTPException(
            status_code=500,
            detail="pypdf library is not installed on server. Please install pypdf to parse PDF files."
        )
    try:
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        extracted_pages = []
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                extracted_pages.append(text)
        return "\n\n".join(extracted_pages)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF document: {str(e)}")
