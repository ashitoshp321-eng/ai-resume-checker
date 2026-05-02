from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class JobDescriptionCreate(BaseModel):
    title: str = Field(..., example="Senior Software Engineer")
    content: str = Field(..., example="We are looking for a backend engineer...")


class JobDescriptionResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ParsedResumeFields(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    experience_years: Optional[int] = None
    education: List[str] = []


class ResumeResponse(BaseModel):
    id: int
    filename: str
    parsed_fields: ParsedResumeFields
    
    model_config = ConfigDict(from_attributes=True)


class UploadResponse(BaseModel):
    uploaded: List[ResumeResponse]


class ScreenRequest(BaseModel):
    jd_id: int
    resume_ids: List[int]


class ScreenedCandidate(BaseModel):
    resume_id: int
    filename: str
    score: float
    rank: int
    parsed_json: ParsedResumeFields
    
    model_config = ConfigDict(from_attributes=True)


class ScreenResponse(BaseModel):
    results: List[ScreenedCandidate]


class CandidatesResponse(BaseModel):
    candidates: List[ScreenedCandidate]


class ChatRequest(BaseModel):
    message: str
    jd_id: int


class ChatResponse(BaseModel):
    reply: str
    cited_candidates: List[int] = []
