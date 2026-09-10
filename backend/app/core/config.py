from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://tunnelsight:tunnelsight@localhost:5432/tunnelsight"
    SESSION_SECRET: str = "change-me-to-32-plus-random-chars-minimum"
    SESSION_COOKIE_NAME: str = "ts_session"
    SESSION_EXPIRE_DAYS: int = 7
    FRONTEND_URL: str = "http://localhost:3000"

    # OpenRouter (AI explanation layer). Without an API key the AI routes answer
    # 503 and the deterministic findings remain fully usable.
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "nvidia/llama-3.1-nemotron-ultra-253b-v1:free"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_TIMEOUT_SECONDS: float = 60.0
    OPENROUTER_MAX_TOKENS: int = 2000

    class Config:
        env_file = ".env"


settings = Settings()
