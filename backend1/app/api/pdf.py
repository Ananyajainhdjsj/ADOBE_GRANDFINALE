from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
import shutil, uuid, os
from app.storage.pdf_store import save_pdf, list_pdfs, get_pdf_path
from app.core.pdf_extractor import extract_outline_text

router = APIRouter()

@router.post("/pdf/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not (file.filename.lower().endswith(".pdf") or file.filename.lower().endswith(".json")):
        raise HTTPException(status_code=400, detail="Only PDF and JSON files allowed")
    doc_id = str(uuid.uuid4())
    path = save_pdf(doc_id, file)
    outline, text = extract_outline_text(path)
    return {"doc_id": doc_id, "outline": outline, "text_preview": text[:1000]}


@router.get("/pdf/{doc_id}/file")
def get_pdf(doc_id: str):
    path = get_pdf_path(doc_id)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="PDF not found")
    with open(path, "rb") as f:
        pdf_bytes = f.read()
    headers = {
        "Content-Disposition": f'inline; filename="{doc_id}.pdf"',
        "Access-Control-Allow-Origin": "*"
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)

@router.get("/pdf/list")
def pdf_list():
    return {"pdfs": list_pdfs()}
