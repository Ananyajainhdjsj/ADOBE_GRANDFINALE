from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
import os
from app.services import gemini_service

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/gemini/upload")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
    temp_dir = "/app/temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_paths = []
    try:
        for file in files:
            file_path = os.path.join(temp_dir, file.filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())
            file_paths.append(file_path)
        gemini_service.update_faiss_index(file_paths)
    finally:
        for path in file_paths:
            try:
                os.remove(path)
            except Exception:
                pass
    return {"success": True}

@router.post("/gemini/summarise")
async def summarise(req: QuestionRequest):
    try:
        result = gemini_service.answer_question(req.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
