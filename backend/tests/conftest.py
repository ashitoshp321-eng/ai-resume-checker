import pytest
import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.database import Base, get_db

# Use an in-memory SQLite DB for tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestingSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def override_get_db():
    async with TestingSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
async def setup_db():
    # Setup tables before each test
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Drop tables after each test
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

@pytest.fixture
def test_pdf_path(tmp_path):
    """Generate a simple PDF for testing using reportlab."""
    try:
        from reportlab.pdfgen import canvas
    except ImportError:
        pytest.skip("reportlab not installed, skipping test")
        
    pdf_path = tmp_path / "test_resume.pdf"
    c = canvas.Canvas(str(pdf_path))
    c.drawString(100, 750, "Jane Doe")
    c.drawString(100, 730, "jane.doe@example.com")
    c.drawString(100, 710, "555-123-4567")
    c.drawString(100, 690, "Skills: Python, React, PostgreSQL")
    c.drawString(100, 670, "I have 5 years of experience in software engineering.")
    c.save()
    
    return str(pdf_path)
