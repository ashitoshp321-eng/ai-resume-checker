import pytest

@pytest.mark.asyncio
async def test_health_check(async_client):
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": "1.0.0"}

@pytest.mark.asyncio
async def test_job_description_flow(async_client):
    # 1. Create JD
    jd_data = {"title": "Software Engineer", "content": "Need Python skills"}
    response = await async_client.post("/api/job-description", json=jd_data)
    assert response.status_code == 200
    jd = response.json()
    assert jd["title"] == "Software Engineer"
    assert "id" in jd
    jd_id = jd["id"]
    
    # We can't easily test file upload endpoint in this simple test without mocking the file read, 
    # but we can test if it correctly rejects missing files
    response = await async_client.post("/api/upload-resumes")
    assert response.status_code == 422 # Unprocessable Entity (missing file field)
