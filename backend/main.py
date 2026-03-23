from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze_code
from ai_reviewer import ai_review
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Membuka jalur komunikasi untuk Frontend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Saat produksi, ganti "*" dengan URL frontend spesifik
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

@app.post("/review")
async def review_code(request: CodeRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Kode tidak boleh kosong.")
    
    try:
        # Analisis statis berjalan sinkron (cepat)
        static_analysis = analyze_code(request.code)
        
        # Review AI HARUS di-await agar tidak memblokir server
        ai_analysis = await ai_review(request.code)
        
        return {
            "static_issues": static_analysis,
            "ai_review": ai_analysis
        }
    except Exception as e:
        # Jangan pernah biarkan server mati diam-diam
        raise HTTPException(status_code=500, detail=str(e))