from pydantic_settings import BaseSettings
import logging

class Settings(BaseSettings):
    ALLOW_ORIGINS: list[str] = ["*"]

def get_settings():
    return Settings()

logging.basicConfig(level=logging.INFO)
