
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from app.core.pdf_outline_extractor import PDFOutlineExtractor
from app.core.chunker import chunk_text
from app.core.embeddings import embed_texts
from app.core.ranker import rank_chunks_with_sections

router = APIRouter()

PDF_DIR = os.environ.get("PDF_DIR", "d:/work/backend1/data/pdfs")

class SnippetRequest(BaseModel):
    pdf_id: str
    selection: str
    context: Optional[str] = None
    top_k: int = 5

class SnippetResponse(BaseModel):
    section_heading: str
    snippet: str
    page_number: int
    pdf_id: str
    section_id: str
    related_sections: Optional[List[Dict[str, Any]]] = None

@router.post("/persona/snippets", response_model=List[SnippetResponse])
async def get_relevant_snippets(request: SnippetRequest):
    # 1. Locate PDF file
    pdf_path = os.path.join(PDF_DIR, f"{request.pdf_id}.pdf")
    if not os.path.exists(pdf_path):
        return []

    # 2. Extract sections
    extractor = PDFOutlineExtractor(max_pages=50)
    outline = extractor.extract_outline(pdf_path)
    sections = outline.get("outline", [])

    # 3. Prepare for chunking
    pages = []
    for section in sections:
        pages.append({
            "document": request.pdf_id,
            "page_number": section.get("page", 0),
            "text": section.get("text", ""),
            "title": section.get("text", "")
        })

    # 4. Chunk sections
    chunks = chunk_text(pages)

    # Defensive: If no chunks, return empty list
    if not chunks:
        return []

    # 5. Rank by similarity to selection/context
    query = request.selection
    if request.context:
        query += " " + request.context
    top_sections, refined_texts = rank_chunks_with_sections(chunks, query)

    # 6. Format response
    results = []
    for section in top_sections:
        results.append(SnippetResponse(
            section_heading=section["title"],
            snippet=section["text"][:400],
            page_number=section["page_number"],
            pdf_id=request.pdf_id,
            section_id=section["title"],
            related_sections=[] # Placeholder for future semantic linking
        ))
    return results
