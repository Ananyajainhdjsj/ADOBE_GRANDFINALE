import google.generativeai as genai
from .rag_store import open_store, add_chunk
from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader
import os

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "AIzaSyDevLzJIM-I20i3OBTCE4ZINUBfwRzNuE8"))
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text):
    return embed_model.encode([text])[0]

def chunk_text(text, chunk_size=300, overlap=50):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = words[i:i+chunk_size]
        chunks.append(" ".join(chunk))
        i += chunk_size - overlap
    return chunks

def ingest_document(doc_id, text):
    store = open_store()
    chunks = chunk_text(text)
    for idx, chunk in enumerate(chunks):
        emb = embed_text(chunk)
        add_chunk(store, f"{doc_id}_chunk_{idx}", chunk, emb, {"doc": doc_id})
    store.close()
    return len(chunks)

def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text
