from sentence_transformers import SentenceTransformer
import numpy as np

from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Initialize model lazily to save memory during tests if not needed
_model = None

def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        logger.info(f"Loading SentenceTransformer model: {settings.EMBEDDING_MODEL}")
        # cpu is fine for inference
        _model = SentenceTransformer(settings.EMBEDDING_MODEL, device="cpu")
    return _model

def get_embedding(text: str) -> np.ndarray:
    """
    Generate an embedding vector for the given text.
    """
    if not text or not text.strip():
        # Return zero vector for empty text. 
        # all-MiniLM-L6-v2 produces 384-dimensional vectors.
        return np.zeros(384, dtype=np.float32)
        
    model = get_model()
    # Ensure float32 for faiss compatibility
    embedding = model.encode(text, convert_to_numpy=True).astype(np.float32)
    return embedding

def get_embeddings_batch(texts: list[str]) -> np.ndarray:
    """
    Generate embedding vectors for a batch of texts.
    """
    if not texts:
        return np.array([], dtype=np.float32)
        
    model = get_model()
    embeddings = model.encode(texts, convert_to_numpy=True).astype(np.float32)
    return embeddings
