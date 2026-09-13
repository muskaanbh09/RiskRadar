from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "RiskRadar API"
    database_url: str = "sqlite:///./riskradar.db"
    jwt_secret: str = "change-this-in-production"
    cors_origins: str = "http://localhost:5173,http://localhost:8443"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
