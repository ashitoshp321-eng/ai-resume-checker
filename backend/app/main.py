from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables
from app.utils.logger import setup_logging
from app.routers import resumes, job_descriptions, screening, chat

# Set up logging globally
logger = setup_logging()

from app.services.embeddings import get_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up Smart Resume Screening System...")
    await create_tables()
    # Pre-load embedding model
    get_model()
    yield
    # Shutdown
    logger.info("Shutting down...")

app = FastAPI(
    title="Smart Resume Screening API",
    description="Backend for AI-powered resume screening and HR chatbot",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resumes.router)
app.include_router(job_descriptions.router)
app.include_router(screening.router)
app.include_router(chat.router)

@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
