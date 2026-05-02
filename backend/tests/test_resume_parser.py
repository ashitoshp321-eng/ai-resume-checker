from app.services.resume_parser import extract_email, extract_phone, extract_skills, extract_experience_years, parse_resume

def test_extract_email():
    text = "Contact me at john.doe123@example-domain.com or call me."
    assert extract_email(text) == "john.doe123@example-domain.com"
    
    assert extract_email("No email here") is None

def test_extract_phone():
    assert extract_phone("My number is +1 (555) 123-4567.") == "+1 (555) 123-4567"
    assert extract_phone("Call 555-123-4567 directly") == "555-123-4567"
    assert extract_phone("No phone here") is None

def test_extract_skills():
    text = "I am proficient in Python, React, and PostgreSQL. I also know a bit of Java."
    skills = extract_skills(text)
    assert "python" in skills
    assert "react" in skills
    assert "postgresql" in skills
    assert "java" in skills
    assert "c++" not in skills

def test_extract_experience():
    assert extract_experience_years("I have 5+ years of experience in software") == 5
    assert extract_experience_years("10 yrs experience as a developer") == 10
    assert extract_experience_years("No explicit experience mentioned") is None

def test_parse_resume():
    text = "Jane Doe\njane.doe@test.com\n555-987-6543\nSkills: Python, Docker\n3 years experience."
    parsed = parse_resume(text)
    
    assert parsed["email"] == "jane.doe@test.com"
    assert parsed["phone"] == "555-987-6543"
    assert "python" in parsed["skills"]
    assert "docker" in parsed["skills"]
    assert parsed["experience_years"] == 3
