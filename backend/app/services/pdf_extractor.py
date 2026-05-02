import os
import pdfplumber
import pytesseract
from PIL import Image

from app.utils.logger import get_logger

logger = get_logger(__name__)

async def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file using pdfplumber.
    Falls back to pytesseract OCR if the page seems to be an image (no extractable text).
    """
    text_content = []
    
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return ""
        
    try:
        # pdfplumber is a synchronous library, so we run it blocking.
        # For a truly async app, we'd use run_in_executor, but this is fine for now.
        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                
                if page_text and page_text.strip():
                    text_content.append(page_text)
                else:
                    logger.info(f"Page {i+1} has no text. Attempting OCR...")
                    # Fallback to OCR if tesseract is installed
                    try:
                        # Extract image from page and run OCR
                        im = page.to_image(resolution=300)
                        ocr_text = pytesseract.image_to_string(im.original)
                        if ocr_text.strip():
                            text_content.append(ocr_text)
                    except Exception as e:
                        logger.warning(f"OCR failed for page {i+1}: {e}")
                        
        final_text = "\n".join(text_content).strip()
        logger.info(f"Extracted {len(final_text)} characters from {file_path}")
        return final_text
    except Exception as e:
        logger.error(f"Error extracting text from PDF {file_path}: {e}")
        return ""
