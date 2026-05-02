import re
from typing import Dict, Any, List

# Basic skills dictionary to look for
COMMON_SKILLS = [
    "python", "java", "javascript", "c++", "c#", "ruby", "go", "rust", "php", "typescript",
    "react", "angular", "vue", "node.js", "django", "flask", "fastapi", "spring", "express",
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins",
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch",
    "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn", "tableau", "power bi",
    "html", "css", "sass", "less", "bootstrap", "tailwind", "figma", "sketch",
    "agile", "scrum", "kanban", "jira", "confluence", "git", "github", "gitlab", "bitbucket"
]

def extract_email(text: str) -> str | None:
    # Basic email regex
    match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    return match.group(0) if match else None

def extract_phone(text: str) -> str | None:
    # Matches international and local formats: +1 (555) 123-4567, 555-123-4567, etc.
    match = re.search(r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    return match.group(0) if match else None

def extract_skills(text: str) -> List[str]:
    text_lower = text.lower()
    found_skills = []
    # Avoid substring matches like finding 'go' in 'good'
    for skill in COMMON_SKILLS:
        # Use regex to find exact word match, handling special characters like C++
        escaped_skill = re.escape(skill)
        if re.search(rf'\b{escaped_skill}\b', text_lower):
            found_skills.append(skill)
    return found_skills

def extract_experience_years(text: str) -> int | None:
    # Extremely basic heuristic: look for "X years of experience" or similar
    text_lower = text.lower()
    match = re.search(r'(\d+)\+?\s*(years|yrs)(?:\s+of)?\s+experience', text_lower)
    if match:
        try:
            return int(match.group(1))
        except ValueError:
            pass
    return None

def parse_resume(raw_text: str) -> dict:
    """
    Parse basic fields from raw text.
    In a production system, this would use an LLM or a specialized NLP model like SpaCy.
    """
    return {
        "name": None,  # Name extraction is notoriously hard with regex, usually requires NER
        "email": extract_email(raw_text),
        "phone": extract_phone(raw_text),
        "skills": extract_skills(raw_text),
        "experience_years": extract_experience_years(raw_text),
        "education": []  # Education extraction also requires more complex NLP
    }
