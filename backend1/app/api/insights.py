
import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.config import ONLINE_MODE, LLM_PROVIDER, DATA_DIR
from app.core.summarizer import extractive_summary
from app.services.gemini_client import gemini_summarize
from app.services.local_tts import tts_save_file

router = APIRouter()

class InsightsRequest(BaseModel):
    doc_id: str = None
    chunk_text: str = None
    mode: str = "bulb"   # bulb, keypoints, contradictions

class AudioInsightRequest(BaseModel):
    text: str
    voice: str = "default"
    speed: float = 1.0

@router.post("/insights/summarize")
def summarize(req: InsightsRequest):
    if not req.chunk_text and not req.doc_id:
        raise HTTPException(status_code=400, detail="chunk_text or doc_id required")
    text = req.chunk_text
    if not text and req.doc_id:
        # get doc-level summarization (use extractive on whole doc if present)
        from app.storage.pdf_store import get_pdf_path
        path = get_pdf_path(req.doc_id)
        if not path:
            raise HTTPException(status_code=404, detail="doc not found")
        from app.core.pdf_extractor import extract_text
        text = extract_text(path)
    # Online preference: use Gemini if online and configured
    if ONLINE_MODE and LLM_PROVIDER == "gemini":
        try:
            result = gemini_summarize(text, mode=req.mode)
            return {"source": "gemini", "insights": result}
        except Exception as e:
            # fallback to local extractive summarizer
            pass
    # Offline/default
    summary = extractive_summary(text, num_sentences=4)
    return {"source": "local-extractive", "insights": summary}


# Audio insight endpoint
@router.post("/audio/insight")
def audio_insight(req: AudioInsightRequest):
    if not req.text:
        raise HTTPException(status_code=400, detail="Text required for audio insight.")
    # Generate audio file using local TTS
    filename = f"insight_{os.urandom(6).hex()}.wav"
    try:
        file_path = tts_save_file(req.text, voice=req.voice, filename=filename, speed=req.speed)
        rel_path = os.path.relpath(file_path, DATA_DIR)
        rel_path_url = rel_path.replace('\\', '/')
        return {"audio_url": f"/api/audio/insight/file/{rel_path_url}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio generation failed: {e}")

@router.get("/audio/insight/file/{subpath:path}")
def get_audio_file(subpath: str):
    file_path = os.path.join(DATA_DIR, subpath)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found.")
    return FileResponse(file_path, media_type="audio/wav")
