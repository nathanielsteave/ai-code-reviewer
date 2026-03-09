from fastapi import FastAPI
from pydantic import BaseModel
from analyzer import analyze_code
from ai_reviewer import ai_review

app = FastAPI()

class CodeRequest(BaseModel):
    code: str

@app.post("/review")

def review_code(request: CodeRequest):

    static_analysis = analyze_code(request.code)

    ai_analysis = ai_review(request.code)

    return {
        "static_issues": static_analysis,
        "ai_review": ai_analysis
    }