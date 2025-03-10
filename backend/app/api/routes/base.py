from fastapi import APIRouter, Depends, HTTPException, status
from app.core.config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "api_version": "v1",
        "service": settings.PROJECT_NAME
    } 