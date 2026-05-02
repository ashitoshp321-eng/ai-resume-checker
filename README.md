web link:-http://localhost:5173/. 

# Smart Resume Screening System

An industry-level, full-stack AI-powered resume screening system. It ranks candidate resumes against a Job Description using BERT-based embeddings (SentenceTransformers) and features an interactive HR Chatbot to query the top candidates.

![Architecture Flow](https://via.placeholder.com/800x400?text=FastAPI+%2B+React+%2B+PostgreSQL)

## Features
- **Semantic Ranking**: Uses `all-MiniLM-L6-v2` to embed both the JD and Resumes, then ranks candidates via cosine similarity.
- **PDF Parsing**: Uses `pdfplumber` for text extraction, with an automatic fallback to `pytesseract` (OCR) for scanned PDFs.
- **Data Extraction**: Extracts Name, Email, Phone, Skills, and Experience Years via Regex heuristics.
- **HR Chatbot**: Talk to a virtual assistant powered by OpenAI or Ollama to get summaries of top candidates.
- **Modern Dashboard**: React + Vite + TailwindCSS frontend with drag-and-drop uploads and CSV exports.

## Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Docker** (optional, for running via Compose)
- **Tesseract OCR** (optional, for scanned PDF fallback)
  - Windows: `choco install tesseract`
  - Mac: `brew install tesseract`
  - Linux: `sudo apt install tesseract-ocr`

---

## Getting Started (Local Development)

By default, the backend uses **SQLite** for zero-configuration local development.

### 1. Backend Setup
\`\`\`bash
cd backend
python -m venv venv

# Windows
venv\\Scripts\\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
\`\`\`
The API will be running at `http://localhost:8000/docs` (Swagger UI).

### 2. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The frontend will be running at `http://localhost:5173` (or `3000`).

---

## Running with Docker Compose

To run the full stack (including PostgreSQL) using Docker:

\`\`\`bash
cp .env.example .env
docker compose up --build
\`\`\`
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Database: `localhost:5432`

---

## Configuration

Edit the `.env` file (or `.env.example`) to configure external APIs:

- \`OPENAI_API_KEY\`: Add this to enable the GPT-3.5 HR Chatbot.
- \`OLLAMA_BASE_URL\`: Use a local model (e.g. `http://localhost:11434`) instead of OpenAI.
- \`DATABASE_URL\`: Override this to point to a PostgreSQL instance instead of SQLite.

## Testing
To run the backend tests:
\`\`\`bash
cd backend
pip install pytest pytest-asyncio httpx reportlab
pytest tests/ -v
\`\`\`

## Deployment (Render)
This project includes a `render.yaml` for 1-click deployment on [Render.com](https://render.com). It provisions:
1. Managed PostgreSQL Database
2. FastAPI Python Web Service
3. Static React Frontend Service

Connect your GitHub repository to Render and use the Blueprint spec to deploy.
