from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://tunnelsight:tunnelsight@localhost:5432/tunnelsight"
    SESSION_SECRET: str = "change-me-to-32-plus-random-chars-minimum"
    SESSION_COOKIE_NAME: str = "ts_session"
    SESSION_EXPIRE_DAYS: int = 7
    FRONTEND_URL: str = "http://localhost:3000"

    # Groq (AI explanation layer). Without an API key the AI routes answer
    # 503 and the deterministic findings remain fully usable.
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    GROQ_TIMEOUT_SECONDS: float = 60.0
    GROQ_MAX_TOKENS: int = 2000

    class Config:
        env_file = ".env"


settings = Settings()
