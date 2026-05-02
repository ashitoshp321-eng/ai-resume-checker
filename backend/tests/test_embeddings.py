import numpy as np
from app.services.embeddings import get_embedding, get_embeddings_batch

def test_get_embedding():
    text = "Python developer with 5 years experience"
    emb = get_embedding(text)
    
    assert isinstance(emb, np.ndarray)
    assert emb.dtype == np.float32
    assert len(emb) == 384  # all-MiniLM-L6-v2 dimension

def test_get_embedding_empty():
    emb = get_embedding("")
    assert isinstance(emb, np.ndarray)
    assert np.all(emb == 0.0)

def test_get_embeddings_batch():
    texts = ["Developer", "Manager", "Designer"]
    embs = get_embeddings_batch(texts)
    
    assert isinstance(embs, np.ndarray)
    assert embs.shape == (3, 384)
