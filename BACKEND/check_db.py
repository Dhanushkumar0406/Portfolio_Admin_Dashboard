"""Quick script to check database status."""
from app.core.database import SessionLocal
from app.models import User, Project, Skill

db = SessionLocal()
try:
    users = db.query(User).count()
    projects = db.query(Project).count()
    skills = db.query(Skill).count()

    print(f"Users: {users}")
    print(f"Projects: {projects}")
    print(f"Skills: {skills}")

    if users > 0:
        admin = db.query(User).first()
        print(f"Admin user: {admin.email}")
        print(f"Is superuser: {admin.is_superuser}")
finally:
    db.close()
