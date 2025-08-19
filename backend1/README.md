# Backend API Documentation

This document provides a detailed overview of all the main APIs available in the backend of this project. Each section describes the endpoint, method, request/response format, and its purpose.

---

## Table of Contents
- [Status](#status)
- [PDF Management](#pdf-management)
- [Annotations](#annotations)
- [Chunking & Persona Analysis](#chunking--persona-analysis)
- [Search](#search)
- [Insights & Audio](#insights--audio)
- [Text-to-Speech (TTS)](#text-to-speech-tts)
- [Persona Snippets](#persona-snippets)
- [Gemini Integration](#gemini-integration)

---

## Status
### `GET /status`
- **Description:** Returns the current status of backend services (PDF extractor, search index, insights, TTS) and whether the app is running in online or offline mode.
- **Response:**
  ```json
  {
    "mode": "online|offline",
    "services": {
      "pdf_extractor": true,
      "search_index": true,
      "insights": true|false,
      "tts": true|false
    }
  }
  ```

---

## PDF Management
### `POST /pdf/upload`
- **Description:** Upload a PDF or JSON file for analysis. Returns a document ID, outline, and text preview.
- **Request:** Multipart form-data with a file field.
- **Response:**
  ```json
  { "doc_id": "...", "outline": [...], "text_preview": "..." }
  ```

### `GET /pdf/{doc_id}/file`
- **Description:** Download the original PDF file by document ID.
- **Response:** PDF file stream.

### `GET /pdf/list`
- **Description:** List all uploaded PDFs.
- **Response:**
  ```json
  { "pdfs": [ ... ] }
  ```

---

## Annotations
### `GET /doc/{doc_id}/annotations`
- **Description:** Get all annotations for a document.
- **Response:**
  ```json
  { "annotations": [ ... ] }
  ```

### `POST /doc/{doc_id}/annotations`
- **Description:** Add or update an annotation for a document.
- **Request:** Annotation object (JSON).
- **Response:**
  ```json
  { "ok": true, "annotation": { ... } }
  ```

---

## Chunking & Persona Analysis
### `POST /doc/{doc_id}/chunk`
- **Description:** Chunk a document into fixed-size pieces for search and analysis.
- **Request:**
  ```json
  { "chunk_size": 400 }
  ```
- **Response:**
  ```json
  { "doc_id": "...", "file_type": "pdf|json", "num_chunks": 10, "chunk_ids": [ ... ], "chunks_preview": [ ... ] }
  ```

### `POST /persona-analyze`
- **Description:** Analyze multiple documents for a specific persona and job-to-be-done. Returns structured analysis, relevant sections, and chunk IDs for search.
- **Request:**
  ```json
  {
    "doc_ids": ["..."],
    "persona": { "role": "...", ... },
    "job_to_be_done": { "task": "...", ... },
    "job_description": "...",
    "chunk_size": 400
  }
  ```
- **Response:**
  ```json
  {
    "persona_analysis": { ... },
    "relevant_sections": 5,
    "chunk_ids": [ ... ],
    "processing_time": 1.23
  }
  ```

### `GET /persona-analyze/available-docs`
- **Description:** List all available documents for persona analysis.
- **Response:**
  ```json
  { "available_documents": [ ... ], "total_count": 3 }
  ```

### `DELETE /files/{doc_id}`
- **Description:** Delete a file and its metadata.
- **Response:**
  ```json
  { "message": "File deleted successfully", "doc_id": "..." }
  ```

---

## Search
### `POST /search`
- **Description:** Semantic search over indexed document chunks.
- **Request:**
  ```json
  { "query": "...", "k": 5 }
  ```
- **Response:**
  ```json
  { "results": [ { "chunk_id": "...", "score": 0.9, "text_snippet": "..." }, ... ] }
  ```

---

## Insights & Audio
### `POST /insights/summarize`
- **Description:** Summarize a document or chunk using extractive or Gemini-based summarization.
- **Request:**
  ```json
  { "doc_id": "...", "chunk_text": "...", "mode": "bulb|keypoints|contradictions" }
  ```
- **Response:**
  ```json
  { "source": "gemini|local-extractive", "insights": "..." }
  ```

### `POST /audio/insight`
- **Description:** Generate an audio summary (TTS) for a given text.
- **Request:**
  ```json
  { "text": "...", "voice": "default", "speed": 1.0 }
  ```
- **Response:**
  ```json
  { "audio_url": "/api/audio/insight/file/..." }
  ```

### `GET /audio/insight/file/{subpath}`
- **Description:** Download the generated audio file.
- **Response:** WAV audio file stream.

---

## Text-to-Speech (TTS)
### `POST /audio/generate`
- **Description:** Generate TTS audio for a given text using Azure or local engine.
- **Request:**
  ```json
  { "text": "...", "voice": "default", "format": "wav" }
  ```
- **Response:**
  ```json
  { "source": "azure|local", "file": "..." }
  ```

---

## Persona Snippets
### `POST /persona/snippets`
- **Description:** Get relevant PDF snippets for a persona based on a selection and context.
- **Request:**
  ```json
  { "pdf_id": "...", "selection": "...", "context": "...", "top_k": 5 }
  ```
- **Response:**
  ```json
  [ { "section_heading": "...", "snippet": "...", "page_number": 1, ... } ]
  ```

---

## Gemini Integration
### `POST /gemini/upload`
- **Description:** Upload files to update the Gemini FAISS index.
- **Request:** Multipart form-data with files.
- **Response:**
  ```json
  { "success": true }
  ```

### `POST /gemini/summarise`
- **Description:** Ask a question and get an answer from Gemini.
- **Request:**
  ```json
  { "question": "..." }
  ```
- **Response:**
  ```json
  { ... } // Gemini answer
  ```

---

## Notes
- All endpoints are prefixed with `/api` in deployment.
- Authentication, rate limiting, and error handling are not detailed here but should be considered in production.
- For more details, see the code in `backend1/app/api/`.
