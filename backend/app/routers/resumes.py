import os
import shutil
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.orm import Resume
from app.models.schemas import UploadResponse, ResumeResponse, ParsedResumeFields
from app.services.pdf_extractor import extract_text_from_pdf
from app.services.resume_parser import parse_resume
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api", tags=["resumes"])

@router.post("/upload-resumes", response_model=UploadResponse)
async def upload_resumes(
    files: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db)
):
    if len(files) > settings.MAX_FILES_PER_BATCH:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Maximum {settings.MAX_FILES_PER_BATCH} files allowed per batch."
        )
        
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    uploaded_resumes = []
    
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            continue  # Skip non-PDFs silently or we could raise an error
            
        # Check size (basic check by reading chunk)
        # Better handled by middleware or proxy, but good enough here
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
            logger.warning(f"File {file.filename} exceeds size limit.")
            continue
            
        file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(content)
            
        # Extract text
        raw_text = await extract_text_from_pdf(file_path)
        
        # Parse fields
        parsed_fields = parse_resume(raw_text)
        
        # Save to DB
        db_resume = Resume(
            filename=file.filename,
            raw_text=raw_text,
            parsed_json=parsed_fields,
            file_path=file_path
        )
        db.add(db_resume)
        await db.flush()  # To get the ID
        
        uploaded_resumes.append(
            ResumeResponse(
                id=db_resume.id,
                filename=db_resume.filename,
                parsed_fields=ParsedResumeFields(**parsed_fields)
            )
        )
        
    if not uploaded_resumes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid PDF files were uploaded or processed."
        )
        
    await db.commit()
    return UploadResponse(uploaded=uploaded_resumes)
