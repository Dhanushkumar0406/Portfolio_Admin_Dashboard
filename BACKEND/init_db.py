"""
Database initialization script.
Creates all tables and optionally seeds initial data.
"""
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.core.config import settings
from app.models import User, Project, Skill, Experience, Education, ThreeConfig, Contact
from app.core.security import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_tables():
    """Create all database tables."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("✓ Database tables created successfully!")


def create_superuser(db: Session):
    """Create initial superuser if it doesn't exist."""
    logger.info("Checking for superuser...")
    
    # Check if any user exists
    existing_user = db.query(User).filter(User.email == "admin@example.com").first()
    if existing_user:
        logger.info("Superuser already exists.")
        return existing_user
    
    # Create superuser
    superuser = User(
        email="admin@example.com",
        hashed_password=get_password_hash("admin123"),
        full_name="Admin User",
        is_active=True,
        is_superuser=True
    )
    db.add(superuser)
    db.commit()
    db.refresh(superuser)
    logger.info("✓ Superuser created successfully!")
    logger.info(f"  Email: admin@example.com")
    logger.info(f"  Password: admin123")
    logger.info("  ⚠️  IMPORTANT: Change this password immediately!")
    return superuser


def seed_sample_data(db: Session, user: User):
    """Seed sample portfolio data."""
    logger.info("Seeding sample data...")
    
    # Sample Skills
    skills_data = [
        {"name": "React", "category": "Frontend", "proficiency": 90, "icon_url": "/icons/react.svg"},
        {"name": "Three.js", "category": "3D", "proficiency": 85, "icon_url": "/icons/threejs.svg"},
        {"name": "Python", "category": "Backend", "proficiency": 88, "icon_url": "/icons/python.svg"},
        {"name": "FastAPI", "category": "Backend", "proficiency": 85, "icon_url": "/icons/fastapi.svg"},
        {"name": "PostgreSQL", "category": "Database", "proficiency": 82, "icon_url": "/icons/postgresql.svg"},
    ]
    
    for idx, skill_data in enumerate(skills_data):
        skill = Skill(**skill_data, user_id=user.id, display_order=idx)
        db.add(skill)
    
    # Sample Project
    project = Project(
        user_id=user.id,
        title="3D Portfolio Website",
        description="An interactive 3D portfolio website built with React Three Fiber",
        short_description="Interactive 3D portfolio with React and Three.js",
        technologies=["React", "Three.js", "FastAPI", "PostgreSQL"],
        category="Web Application",
        featured=True,
        status="completed"
    )
    db.add(project)
    
    db.commit()
    logger.info("✓ Sample data seeded successfully!")


def init_db():
    """Initialize the database with tables and initial data."""
    logger.info("=" * 50)
    logger.info("DATABASE INITIALIZATION")
    logger.info("=" * 50)
    
    # Create tables
    create_tables()
    
    # Create session
    db = SessionLocal()
    try:
        # Create superuser
        superuser = create_superuser(db)
        
        # Seed sample data
        seed_sample_data(db, superuser)
        
        logger.info("=" * 50)
        logger.info("✓ DATABASE INITIALIZATION COMPLETE!")
        logger.info("=" * 50)
        
    except Exception as e:
        logger.error(f"❌ Error during initialization: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
