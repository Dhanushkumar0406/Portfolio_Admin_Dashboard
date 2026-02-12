"""
API v1 router - Aggregates all endpoint routers.
"""
from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    contact,
    projects,
    skills,
    experience,
    education,
    three_assets,
    upload,
    profile,
    site_content,
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(experience.router, prefix="/experience", tags=["Experience"])
api_router.include_router(education.router, prefix="/education", tags=["Education"])
api_router.include_router(three_assets.router, prefix="/three-config", tags=["3D Assets"])
api_router.include_router(upload.router, prefix="/upload", tags=["File Upload"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
api_router.include_router(site_content.router, prefix="/site-content", tags=["Site Content"])
