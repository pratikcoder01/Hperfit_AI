from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, SecretStr
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # ── Application ───────────────────────────
    APP_NAME: str = "HyperFitness"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # ── API ───────────────────────────────────
    API_PREFIX: str = "/api/v1"
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "https://hyperfitness.io",
        "https://hyperfitness.vercel.app",
    ]

    # ── Database ──────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/hyperfitness"

    # ── JWT ───────────────────────────────────
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── Security ──────────────────────────────
    BCRYPT_ROUNDS: int = 12
    RATE_LIMIT_PER_MINUTE: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
