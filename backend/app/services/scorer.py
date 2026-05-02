import numpy as np

def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    Calculate the cosine similarity between two vectors.
    Returns a float between -1.0 and 1.0.
    """
    # Handle zero vectors
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
        
    dot_product = np.dot(vec1, vec2)
    return float(dot_product / (norm1 * norm2))

def calculate_score(jd_embedding: np.ndarray, resume_embedding: np.ndarray) -> float:
    """
    Calculate a match score between 0.0 and 100.0 based on cosine similarity.
    """
    sim = cosine_similarity(jd_embedding, resume_embedding)
    
    # Cosine similarity is [-1, 1], but in NLP with sentence-transformers 
    # it's usually between 0 and 1 for related text, maybe slightly negative for completely opposite.
    # Let's map [0, 1] to [0, 100], and clamp negatives to 0.
    score = max(0.0, sim) * 100.0
    
    # Round to 1 decimal place
    return round(score, 1)

def rank_candidates(jd_embedding: np.ndarray, resume_embeddings: list[np.ndarray], resume_ids: list[int]) -> list[dict]:
    """
    Rank a batch of resumes against a job description.
    Returns a list of dicts: {"resume_id": id, "score": score, "rank": rank}
    """
    results = []
    
    for i, emb in enumerate(resume_embeddings):
        score = calculate_score(jd_embedding, emb)
        results.append({"resume_id": resume_ids[i], "score": score})
        
    # Sort descending by score
    results.sort(key=lambda x: x["score"], reverse=True)
    
    # Assign ranks
    for rank, res in enumerate(results, 1):
        res["rank"] = rank
        
    return results
