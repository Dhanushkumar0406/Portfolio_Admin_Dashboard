from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Fix Render's postgres:// URL to postgresql:// (required by SQLAlchemy 2.0+)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Create database engine with appropriate settings based on database type
if db_url.startswith("sqlite"):
    # SQLite-specific configuration
    engine = create_engine(
        db_url,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False}  # Allow SQLite to be used with FastAPI
    )
else:
    # PostgreSQL/other database configuration
    engine = create_engine(
        db_url,
        echo=settings.DEBUG,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


# Dependency to get DB session
def get_db():
    """Database session generator for dependency injection."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
