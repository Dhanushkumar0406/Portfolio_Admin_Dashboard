"""
CORS middleware configuration.
Note: CORS is configured in main.py using FastAPI's CORSMiddleware.
This file provides additional CORS utilities if needed.
"""
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings


def get_cors_config() -> dict:
    """
    Get CORS configuration dictionary.
    
    Returns:
        Dictionary with CORS configuration
    """
    return {
        "allow_origins": settings.BACKEND_CORS_ORIGINS,
        "allow_credentials": True,
        "allow_methods": ["*"],
        "allow_headers": ["*"],
        "expose_headers": ["Content-Disposition"]
    }


def configure_cors(app) -> None:
    """
    Configure CORS middleware for FastAPI application.
    
    Args:
        app: FastAPI application instance
    """
    cors_config = get_cors_config()
    app.add_middleware(CORSMiddleware, **cors_config)
