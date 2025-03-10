from fastapi import APIRouter

from app.api.routes import base, auth, jobs

api_router = APIRouter()
api_router.include_router(base.router, prefix="/base", tags=["base"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"]) 