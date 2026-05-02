import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.orm import JobDescription, Screening, Resume
from app.models.schemas import ChatRequest, ChatResponse
from app.services.chatbot import get_chatbot_response
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api", tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_hr_bot(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Chat with the HR assistant. Injects top candidates as context.
    """
    # 1. Fetch JD
    jd = await db.get(JobDescription, req.jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Job description not found")

    # 2. Fetch Top Candidates (e.g., top 5)
    stmt = select(Screening, Resume).join(Resume).where(Screening.jd_id == req.jd_id).order_by(Screening.rank.asc()).limit(5)
    result = await db.execute(stmt)
    rows = result.all()
    
    if not rows:
        context = f"Job Description: {jd.title}\n{jd.content}\n\nNo candidates have been screened yet."
        cited_ids = []
    else:
        candidates_context = []
        cited_ids = []
        for screening, resume in rows:
            cited_ids.append(resume.id)
            parsed = resume.parsed_json
            skills = ", ".join(parsed.get("skills", []))
            exp = parsed.get("experience_years")
            
            c_text = f"Candidate ID: {resume.id}\n"
            c_text += f"Filename: {resume.filename}\n"
            c_text += f"Match Score: {screening.score}/100 (Rank: {screening.rank})\n"
            c_text += f"Skills: {skills}\n"
            if exp:
                c_text += f"Experience: {exp} years\n"
            # Add a snippet of raw text for more context
            c_text += f"Snippet: {resume.raw_text[:200]}...\n"
            
            candidates_context.append(c_text)
            
        context = f"Job Description: {jd.title}\n{jd.content}\n\nTop Candidates:\n" + "\n---\n".join(candidates_context)

    # 3. Call LLM
    reply = await get_chatbot_response(req.message, context)
    
    return ChatResponse(reply=reply, cited_candidates=cited_ids)
