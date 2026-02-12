"""
FastAPI main application for 3D Portfolio Backend.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.site_content import SiteContent
from app.api.v1.router import api_router
from app.middleware.error_handler import add_exception_handlers
from sqlalchemy import text, inspect
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
    # Ensure any new tables are created (safe no-op if already present).
    Base.metadata.create_all(bind=engine)
    ensure_site_content_columns()
    ensure_experience_columns()

    # Ensure a dev/admin user exists for local login.
    if settings.DEBUG:
        email = settings.FIRST_SUPERUSER_EMAIL or "admin@example.com"
        password = settings.FIRST_SUPERUSER_PASSWORD or "admin123"
        name = settings.FIRST_SUPERUSER_NAME or "Admin User"
        if password:
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.email == email).first()
                if user:
                    # Keep login consistent with .env on dev startup
                    user.hashed_password = get_password_hash(password)
                    if not user.full_name:
                        user.full_name = name
                else:
                    user = User(
                        email=email,
                        hashed_password=get_password_hash(password),
                        full_name=name,
                        is_active=True,
                        is_superuser=True,
                    )
                    db.add(user)
                db.commit()

                # Ensure at least one editable homepage content row exists.
                active_content = (
                    db.query(SiteContent)
                    .filter(SiteContent.is_active.is_(True))
                    .first()
                )
                if not active_content:
                    db.add(
                        SiteContent(
                            user_id=user.id,
                            name="Default Home",
                            is_active=True,
                            display_name=name,
                            icon_text="3D",
                            eyebrow_text=f"Hello! I am {name}",
                            hero_title="A designer who judges a book by its cover.",
                            hero_subtitle=(
                                "I build cinematic, interactive experiences for brands and studios."
                            ),
                            cta_primary_text="View Work",
                            cta_primary_link="/projects",
                            cta_secondary_text="Hire Me",
                            cta_secondary_link="/contact",
                        )
                    )
                    db.commit()
            finally:
                db.close()
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
        "Info": "Welcome to 3D Portfolio Backend API",
        "version": settings.APP_VERSION,
        "status": "FastAPI Backend is running Successfully !...."
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "database": "Post GreSQL is connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8006,
        reload=settings.DEBUG
    )


def ensure_site_content_columns():
    """
    Lightweight migration helper for new SiteContent fields.
    Adds columns if they are missing (dialect-safe for SQLite/Postgres).
    """
    new_columns = {
        "brand_initials": "TEXT",
        "brand_title": "TEXT",
        "brand_tagline": "TEXT",
        "nav_cta_text": "TEXT",
        "nav_cta_link": "TEXT",
        "contact_title": "TEXT",
        "contact_subtitle": "TEXT",
        "contact_email": "TEXT",
        "contact_location": "TEXT",
        "contact_availability": "TEXT",
        "contact_response_time": "TEXT",
        "footer_tagline": "TEXT",
        "footer_email": "TEXT",
        "footer_location": "TEXT",
        "footer_availability": "TEXT",
        "footer_links": "JSON",
        "footer_disclaimer": "TEXT",
        "footer_rights": "TEXT",
        "about_title": "TEXT",
        "about_body_primary": "TEXT",
        "about_body_secondary": "TEXT",
        "about_snapshot_focus": "TEXT",
        "about_snapshot_stack": "TEXT",
        "about_snapshot_availability": "TEXT",
        "profile_slug": "TEXT",
    }

    with engine.begin() as conn:
        inspector = inspect(conn)
        try:
          columns = inspector.get_columns("site_content")
          existing = {col["name"] for col in columns}
        except Exception:
          # If table doesn't exist yet, nothing to do (create_all will create)
          return
        for column, sql_type in new_columns.items():
            if column not in existing:
                # SQLite/Postgres compatible types already defined above
                conn.execute(text(f'ALTER TABLE site_content ADD COLUMN "{column}" {sql_type}'))


def ensure_experience_columns():
    """Add profile_slug to experience table if missing."""
    with engine.begin() as conn:
        inspector = inspect(conn)
        try:
            columns = inspector.get_columns("experience")
            existing = {col["name"] for col in columns}
        except Exception:
            return
        if "profile_slug" not in existing:
            conn.execute(text('ALTER TABLE experience ADD COLUMN "profile_slug" TEXT'))
