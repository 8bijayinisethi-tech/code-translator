import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import TranslateRequest,TranslateResponse
from agents import orchestrate, translate, review, analyse



app = FastAPI(title = "Multi-agent Code Translator")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.get("/")
def health_check():
    return {"status":"running"}

@app.post("/translate", response_model=TranslateResponse)
async def translate_code(request: TranslateRequest):

    if request.from_lang == request.to_lang:
        raise HTTPException(
            status_code=400,
            detail="Source and target languages must be different"
        )

    if not request.source_code.strip():
        raise HTTPException(
            status_code=400,
            detail="Source code cannot be empty"
        )
    _,analysis = await asyncio.gather(
        orchestrate(request.source_code, request.from_lang, request.to_lang),
        analyse(request.source_code, request.from_lang, request.to_lang)
    )
    

    draft =  await translate(request.source_code, request.from_lang, request.to_lang, analysis)
    final_code, review_note = await review(request.source_code, draft, request.from_lang, request.to_lang)

    return TranslateResponse(
        translated_code=final_code,
        analysis=analysis,
        review_note=review_note
    )
