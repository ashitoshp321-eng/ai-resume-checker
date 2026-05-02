import pytest
from app.services.pdf_extractor import extract_text_from_pdf

@pytest.mark.asyncio
async def test_extract_text_from_pdf(test_pdf_path):
    text = await extract_text_from_pdf(test_pdf_path)
    
    assert text is not None
    assert "Jane Doe" in text
    assert "jane.doe@example.com" in text
    assert "Python" in text

@pytest.mark.asyncio
async def test_extract_text_from_missing_pdf():
    text = await extract_text_from_pdf("nonexistent_file.pdf")
    assert text == ""
