from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os



from app.api import pdf, chunks, search, insights, tts, annotations, status, gemini, persona
from app.rag import api as rag_api


from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles   # <-- add this import

app = FastAPI(title="PDF Insights Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to allow iframe embedding (removes X-Frame-Options header)

# Middleware to allow iframe embedding (removes X-Frame-Options header)
class AllowIframeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        if isinstance(response, Response):
            if "x-frame-options" in response.headers:
                del response.headers["x-frame-options"]
        return response

app.add_middleware(AllowIframeMiddleware)

app.include_router(pdf.router, prefix="/api")
app.include_router(chunks.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(tts.router, prefix="/api")
app.include_router(annotations.router, prefix="/api")
app.include_router(status.router, prefix="/api")


app.include_router(gemini.router, prefix="/api")
app.include_router(persona.router, prefix="/api")

# RAG Insights endpoints
app.include_router(rag_api.router, prefix="/api")

@app.on_event("startup")
def startup_event():
    # Create storage dirs if missing
    from app.config import PDF_DIR, ANNOTATION_DIR, INSIGHTS_DIR, INDEX_DIR
    for d in (PDF_DIR, ANNOTATION_DIR, INSIGHTS_DIR, INDEX_DIR):
        os.makedirs(d, exist_ok=True)
        app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    # serve static assets (js, css, images)
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    # index.html at root
    @app.get("/")
    def index():
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

    # fallback for SPA routes
    @app.get("/{full_path:path}")
    def spa_fallback(full_path: str):
        if full_path.startswith("api/"):
            return {"detail": "Not found"}
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))