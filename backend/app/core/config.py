from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    API_PORT: int = int(os.getenv("API_PORT"))
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Resume Job Matcher API"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME")
    SECRET_KEY: str = os.getenv("SECRET_KEY")  
    ALGORITHM: str = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_MINUTES: int = os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES")  
    JWT_PRIVATE_KEY: str = os.getenv("JWT_PRIVATE_KEY")  
    JWT_PUBLIC_KEY: str = os.getenv("JWT_PUBLIC_KEY")  
    CLIENT_ORIGIN: str = os.getenv("CLIENT_ORIGIN", "http://localhost:3000")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 