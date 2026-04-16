# backend/config.py
"""
Application configuration.
Reads all settings from the .env file via pydantic-settings.
This is the ONLY place the API key is accessed — it is never
hardcoded anywhere else in the codebase.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Twelve Data API key — loaded from .env
    TWELVE_DATA_API_KEY: str

    # CORS origins that are allowed to call this backend.
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ]

    # Rate-limit settings for yfinance proxy endpoints.
    # yfinance is free, but we keep a generic high limit to prevent spam.
    RATE_LIMIT_MAX_REQUESTS: int = 200
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


# Single shared settings instance — import this everywhere else
settings = Settings()
