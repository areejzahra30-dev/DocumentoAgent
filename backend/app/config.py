from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    host: str = "0.0.0.0"
    port: int = 8000
    environment: str = "development"

    database_url: str

    better_auth_secret: str
    better_auth_url: str = "http://localhost:3000"

    gemini_api_key: str
    gemini_model: str = "gemini-2.5-flash"

    uploadthing_secret: str

    allowed_origins: str = "http://localhost:3000"
    log_level: str = "DEBUG"

    model_config = {"env_file": ".env", "extra": "allow"}


settings = Settings()
