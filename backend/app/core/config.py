from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://tunnelsight:tunnelsight@localhost:5432/tunnelsight"
    SESSION_SECRET: str = "change-me-to-32-plus-random-chars-minimum"
    SESSION_COOKIE_NAME: str = "ts_session"
    SESSION_EXPIRE_DAYS: int = 7
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()
