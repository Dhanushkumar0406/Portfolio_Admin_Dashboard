"""
FastAPI main application for 3D Portfolio Backend.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router
from app.middleware.error_handler import add_exception_handlers
import os

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for 3D Portfolio with Three.js support",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add custom exception handlers
add_exception_handlers(app)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Mount static files (uploads)
upload_dir = settings.UPLOAD_DIR
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir)

app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")


@app.on_event("startup")
async def startup_event():
    """Startup event handler."""
    print(f">> Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f">> API Documentation: http://localhost:8006/docs")
    print(f">> Database: Connected")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler."""
    print(f">> Shutting down {settings.APP_NAME}")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to 3D Portfolio API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8006,
        reload=settings.DEBUG
    )
