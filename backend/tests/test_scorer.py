import numpy as np
from app.services.scorer import cosine_similarity, calculate_score, rank_candidates

def test_cosine_similarity():
    vec1 = np.array([1.0, 0.0, 0.0])
    vec2 = np.array([1.0, 0.0, 0.0])
    vec3 = np.array([0.0, 1.0, 0.0])
    
    assert cosine_similarity(vec1, vec2) == 1.0
    assert cosine_similarity(vec1, vec3) == 0.0

def test_calculate_score():
    # Similar vectors -> near 100
    vec1 = np.array([0.8, 0.6])
    vec2 = np.array([0.8, 0.6])
    assert calculate_score(vec1, vec2) == 100.0
    
    # Orthogonal vectors -> 0
    vec3 = np.array([-0.6, 0.8])
    assert calculate_score(vec1, vec3) == 0.0

def test_rank_candidates():
    jd_emb = np.array([1.0, 0.0])
    # res1 is perfect, res2 is half, res3 is bad
    res_embs = [
        np.array([0.0, 1.0]),  # Bad (orthogonal)
        np.array([1.0, 0.0]),  # Perfect
        np.array([0.707, 0.707]) # Middle
    ]
    res_ids = [1, 2, 3]
    
    ranks = rank_candidates(jd_emb, res_embs, res_ids)
    
    assert len(ranks) == 3
    # Best should be id 2, rank 1
    assert ranks[0]["resume_id"] == 2
    assert ranks[0]["rank"] == 1
    assert ranks[0]["score"] == 100.0
    
    # Middle should be id 3, rank 2
    assert ranks[1]["resume_id"] == 3
    assert ranks[1]["rank"] == 2
    
    # Worst should be id 1, rank 3
    assert ranks[2]["resume_id"] == 1
    assert ranks[2]["rank"] == 3
