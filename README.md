# PDF Insights

PDF Insights is an AI-powered PDF Insights platform that allows users to upload PDFs, analyze content, and generate meaningful insights using LLMs (Gemini).
It features a React.js frontend and a FastAPI backend, containerized into a single deployable image.

<br>

### 🚀 Features
- Upload and analyze PDFs with AI.
- Powered by Google Gemini for insights.
- Text-to-Speech support via Azure TTS.
- Fast and lightweight backend using FastAPI + Uvicorn.
- Responsive frontend built with React.js.
- Single-container deployment – no Nginx, no multiple services.

<br>

### 🛠️ Tech Stack
- Frontend: React.js +Tailwind css
- Backend: FastAPI (Python 3.10+)
- AI/LLM: Gemini (gemini-2.5-flash)
- TTS: Azure TTS
- Containerization: Docker
  
<br>

### 📂 Project Structure
```bash
adobe_grandfinale/
├── backend1/         # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
├── frontend/         # React frontend
│   ├── package.json
│   ├── public/
│   ├── src/
├── Dockerfile  # Single container build
```
<br>
<br>

### ⚙️ Environment Variables

When running the container, provide these environment variables:

Variable	Description
```bash
ADOBE_EMBED_API_KEY	Adobe Embed API key
LLM_PROVIDER	LLM provider (gemini)
GOOGLE_APPLICATION_CREDENTIALS	Path to Google Cloud credentials JSON
GEMINI_MODEL	Gemini model (default: gemini-2.5-flash)
TTS_PROVIDER	TTS provider (azure)
AZURE_TTS_KEY	Azure TTS key
AZURE_TTS_ENDPOINT	Azure TTS endpoint
```

<br>

### 🐳 Build & Run Instructions
1. Build the Docker image <br>
```bash
docker build --platform linux/amd64 -t ADOBE_GRANDFINALE .
```

3. Run the container <br>
```bash
docker run -v /path/to/credentials:/credentials \
  -e ADOBE_EMBED_API_KEY=<ADOBE_EMBED_API_KEY> \
  -e LLM_PROVIDER=gemini \
  -e GOOGLE_APPLICATION_CREDENTIALS=/credentials/adbe-gcp.json \
  -e GEMINI_MODEL=gemini-2.5-flash \
  -e TTS_PROVIDER=azure \
  -e AZURE_TTS_KEY=<TTS_KEY> \
  -e AZURE_TTS_ENDPOINT=<TTS_ENDPOINT> \
  -p 8080:8080 ADOBE_GRANDFINALE
```

### 🌐 Access

Frontend: http://localhost:8080
Backend API: http://localhost:8080/api
