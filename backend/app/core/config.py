from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "Closira Enquiry API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str = "sqlite+aiosqlite:///./closira.db"

    # Celery / Redis (optional — falls back to FastAPI BackgroundTasks if not set)
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None

    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"


settings = Settings()
