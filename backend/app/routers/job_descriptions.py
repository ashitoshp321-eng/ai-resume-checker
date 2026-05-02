from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.orm import JobDescription
from app.models.schemas import JobDescriptionCreate, JobDescriptionResponse
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api", tags=["job_descriptions"])

@router.post("/job-description", response_model=JobDescriptionResponse)
async def create_job_description(
    jd: JobDescriptionCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Save a new job description to the database.
    """
    db_jd = JobDescription(
        title=jd.title,
        content=jd.content
    )
    db.add(db_jd)
    await db.commit()
    await db.refresh(db_jd)
    
    logger.info(f"Created job description ID {db_jd.id}")
    return db_jd
