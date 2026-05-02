from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import Optional

from app.database import get_db
from app.models.orm import JobDescription, Resume, Screening
from app.models.schemas import ScreenRequest, ScreenResponse, ScreenedCandidate, CandidatesResponse, ParsedResumeFields
from app.services.embeddings import get_embedding, get_embeddings_batch
from app.services.scorer import rank_candidates
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api", tags=["screening"])

@router.post("/screen", response_model=ScreenResponse)
async def screen_resumes(
    req: ScreenRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Run the screening pipeline to rank resumes against a job description.
    """
    # 1. Fetch JD
    jd = await db.get(JobDescription, req.jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Job description not found")
        
    # 2. Fetch Resumes
    result = await db.execute(select(Resume).where(Resume.id.in_(req.resume_ids)))
    resumes = result.scalars().all()
    
    if not resumes:
        raise HTTPException(status_code=404, detail="No valid resumes found")
        
    # 3. Embed JD
    jd_embedding = get_embedding(jd.content)
    
    # 4. Embed Resumes
    texts = [r.raw_text for r in resumes]
    resume_embeddings = get_embeddings_batch(texts)
    
    # 5. Calculate Scores and Rank
    resume_ids = [r.id for r in resumes]
    ranked_results = rank_candidates(jd_embedding, resume_embeddings, resume_ids)
    
    # 6. Save Screenings to DB
    screened_candidates = []
    
    # Delete old screenings for this batch if they exist
    # (Simplified: in reality you might update them or keep history)
    
    for r_data in ranked_results:
        # Find corresponding resume object
        res_obj = next(r for r in resumes if r.id == r_data["resume_id"])
        
        screening = Screening(
            jd_id=req.jd_id,
            resume_id=r_data["resume_id"],
            score=r_data["score"],
            rank=r_data["rank"]
        )
        db.add(screening)
        
        screened_candidates.append(
            ScreenedCandidate(
                resume_id=res_obj.id,
                filename=res_obj.filename,
                score=r_data["score"],
                rank=r_data["rank"],
                parsed_json=ParsedResumeFields(**res_obj.parsed_json)
            )
        )
        
    await db.commit()
    return ScreenResponse(results=screened_candidates)


@router.get("/candidates", response_model=CandidatesResponse)
async def get_candidates(
    jd_id: Optional[int] = Query(None, description="Filter by Job Description ID"),
    min_score: Optional[float] = Query(None, description="Minimum match score"),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve all screened candidates, optionally filtered.
    """
    stmt = select(Screening, Resume).join(Resume)
    
    conditions = []
    if jd_id is not None:
        conditions.append(Screening.jd_id == jd_id)
    if min_score is not None:
        conditions.append(Screening.score >= min_score)
        
    if conditions:
        stmt = stmt.where(and_(*conditions))
        
    # Sort by rank ascending (best first)
    stmt = stmt.order_by(Screening.rank.asc())
    
    result = await db.execute(stmt)
    rows = result.all()
    
    candidates = []
    for screening, resume in rows:
        candidates.append(
            ScreenedCandidate(
                resume_id=resume.id,
                filename=resume.filename,
                score=screening.score,
                rank=screening.rank,
                parsed_json=ParsedResumeFields(**resume.parsed_json)
            )
        )
        
    return CandidatesResponse(candidates=candidates)
