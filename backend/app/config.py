from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database — defaults to SQLite (zero-config), override with PostgreSQL URL
    DATABASE_URL: str = "sqlite+aiosqlite:///./resume_db.sqlite"

    # Optional LLM keys
    OPENAI_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: Optional[str] = None

    # Security
    SECRET_KEY: str = "change-me-to-something-random-and-secret"

    # File upload limits
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 5
    MAX_FILES_PER_BATCH: int = 20

    # Embedding model (sentence-transformers)
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # CORS origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]


settings = Settings()
