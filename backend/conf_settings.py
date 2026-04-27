from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    groq_api_key: str
    model_name: str = "llama-3.3-70b-versatile"
    max_tokens: int = 1000

    class Config:
        env_file = ".env"

settings = Settings()