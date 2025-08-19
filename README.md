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

### Tabs
- Toolbar: Toggle between pan, draw, and select modes; zoom and rotate pages; use a color palette for pencil and highlighter.

- Viewer: Virtualized PDF pages for smooth performance, smooth zoom and pan, and a non-selectable drawing layer when pencil mode is active. Supports both local PDF rendering and Adobe Embed API viewer.

- Files: Quickly switch between multiple uploaded PDFs.

- Chat Panel: Ask AI questions about the current document via /api/rag/query.

- Insights: Generates contextual ideas and summaries for the highlighted text.

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

### Backend API Overview

Our backend provides PDF management, AI insights, search, and TTS functionality. All endpoints are prefixed with /api.

#### Status

GET /status – Check backend service status (PDF extractor, search index, insights, TTS) and mode (online/offline).

#### PDF Management

POST /pdf/upload – Upload PDF/JSON for analysis → returns doc_id, outline, preview.

GET /pdf/{doc_id}/file – Download PDF by ID.

GET /pdf/list – List all uploaded PDFs.

DELETE /files/{doc_id} – Delete file and metadata.

#### Annotations

GET /doc/{doc_id}/annotations – Fetch document annotations.

POST /doc/{doc_id}/annotations – Add/update an annotation.

#### Chunking & Persona Analysis

POST /doc/{doc_id}/chunk – Split document into chunks for search/analysis.

POST /persona-analyze – Analyze docs for a persona → returns relevant sections and chunk IDs.

GET /persona-analyze/available-docs – List documents available for persona analysis.

#### Search

POST /search – Semantic search over indexed chunks.

#### Insights & Audio

POST /insights/summarize – Summarize document/chunk (extractive or Gemini).

POST /audio/insight – Generate audio summary from text.

GET /audio/insight/file/{subpath} – Download audio file.

#### Text-to-Speech (TTS)

POST /audio/generate – Generate TTS audio (Azure/local).

#### Persona Snippets

POST /persona/snippets – Get PDF snippets for a persona based on selection/context.

#### Gemini Integration

POST /gemini/upload – Update Gemini FAISS index with files.

POST /gemini/summarise – Ask a question and get an AI answer from Gemini.

Notes: Use /api prefix in deployment. Authentication and error handling are not included here; see backend1/app/api/ for full implementation.

<br>
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
 -e GOOGLE_API_KEY=AIzaSyDevLzJIM-I20i3OBTCE4ZINUBfwRzNuE8 backendi
  -e GEMINI_MODEL=gemini-2.5-flash \
  -e TTS_PROVIDER=azure \
  -e AZURE_TTS_KEY=<TTS_KEY> \
  -e AZURE_TTS_ENDPOINT=<TTS_ENDPOINT> \
  -p 8080:8080 ADOBE_GRANDFINALE
```
<br>
ADOBE_CLIENT_ID : 415d3d80cdc74823bd877e17add7346b

<br>

### Alternate Running Commands 
To run backend --
1. Locate to backend folder <br>
```bash
pip install -r requirements. txt
python -m uvicorn app.main:app --reload 
```


To run frontend--
1. Locate to frontend folder <br>
```bash
npm install
npm run dev
```
<br>

### 🌐 Access

Frontend: http://localhost:8080 <br>
Backend API: http://localhost:8080/api

Backend UI viewer: http://localhost:8080/docs

