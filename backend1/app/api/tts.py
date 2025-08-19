import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.local_tts import tts_save_file
from app.services.azure_tts import azure_tts_generate
from app.config import ONLINE_MODE

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    voice: str = "default"
    format: str = "wav"

@router.post("/audio/generate")
def generate_audio(req: TTSRequest):
    provider = os.getenv("TTS_PROVIDER", "pyttsx3").lower()

    if provider == "azure":
        try:
            path = azure_tts_generate(req.text, voice=req.voice, fmt=req.format)
            return {"source": "azure", "file": path}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Azure TTS failed: {e}")

    # default → pyttsx3
    path = tts_save_file(req.text, voice=req.voice, filename=None)
    return {"source": "local", "file": path}
