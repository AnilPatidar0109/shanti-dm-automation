import os
from typing import Optional
from pydantic import AnyHttpUrl, EmailStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Instagram Comment Automation API"

    # Security
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ENCRYPTION_KEY: Optional[str] = None  # Fernet key. If None, derived from JWT_SECRET.

    # Database
    DATABASE_URL: str

    # Redis and Celery
    REDIS_URL: str

    # Meta Graph API
    META_APP_ID: str
    META_APP_SECRET: str
    META_VERIFY_TOKEN: str
    META_OAUTH_SCOPES: str = "instagram_basic,instagram_manage_comments,pages_show_list,pages_read_engagement,instagram_manage_messages,pages_messaging"
    COMMENT_SCAN_INTERVAL_SECONDS: int = 30  # Default: 30s (fast scanning)
    PUBLIC_BASE_URL: Optional[str] = None  # Public HTTPS URL (e.g., https://xxx.ngrok-free.app) for Meta image webhooks and attachments

    # First Superuser / Admin
    FIRST_SUPERUSER: EmailStr
    FIRST_SUPERUSER_PASSWORD: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @field_validator("META_OAUTH_SCOPES", mode="before")
    @classmethod
    def sanitize_oauth_scopes(cls, v: str) -> str:
        if isinstance(v, str):
            # Replace accidental delimiter mistakes like dots, semicolons, spaces
            cleaned = v.replace(";", ",").replace(" ", ",").replace(".", ",")
            scopes = [s.strip() for s in cleaned.split(",") if s.strip()]
            return ",".join(scopes)
        return v

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_url(cls, v: str) -> str:
        # Support postgresql:// -> postgresql+asyncpg:// for async compatibility
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    @property
    def sync_database_url(self) -> str:
        # Returns standard postgresql:// for Alembic or sync connection
        return self.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)


settings = Settings()
StandardDATABASE_URL = settings.DATABASE_URL
