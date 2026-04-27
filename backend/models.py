from pydantic import BaseModel

class TranslateRequest(BaseModel):
    source_code: str
    from_lang: str    
    to_lang: str    

class TranslateResponse(BaseModel):
    translated_code: str
    analysis: str
    review_note: str