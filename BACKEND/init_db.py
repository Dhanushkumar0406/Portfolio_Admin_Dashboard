"""
Database initialization script.
Creates all tables and optionally seeds initial data.
"""
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.core.config import settings
from app.models import User, Project, Skill, Experience, Education, ThreeConfig, Contact, SiteContent
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
    
    email = settings.FIRST_SUPERUSER_EMAIL or "admin@example.com"
    password = settings.FIRST_SUPERUSER_PASSWORD or "admin123"
    name = settings.FIRST_SUPERUSER_NAME or "Admin User"

    # Check if any user exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        # Update password in case it changed in .env
        existing_user.hashed_password = get_password_hash(password)
        db.commit()
        logger.info("Superuser already exists - password updated from .env.")
        return existing_user

    # Create superuser
    superuser = User(
        email=email,
        hashed_password=get_password_hash(password),
        full_name=name,
        is_active=True,
        is_superuser=True
    )
    db.add(superuser)
    db.commit()
    db.refresh(superuser)
    logger.info("✓ Superuser created successfully!")
    logger.info(f"  Email: {email}")
    logger.info(f"  Password: {password}")
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

    # Default editable homepage content
    if not db.query(SiteContent).filter(SiteContent.is_active.is_(True)).first():
        db.add(
            SiteContent(
                user_id=user.id,
                name="Default Home",
                is_active=True,
                display_name=user.full_name or "Harish Kumar",
                icon_text="3D",
                eyebrow_text=f"Hello! I am {user.full_name or 'Harish Kumar'}",
                hero_title="A designer who judges a book by its cover.",
                hero_subtitle="I build cinematic, interactive experiences for brands and studios.",
                cta_primary_text="View Work",
                cta_primary_link="/projects",
                cta_secondary_text="Hire Me",
                cta_secondary_link="/contact",
            )
        )
    
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
