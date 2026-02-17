from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class CRUDProject(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    """CRUD operations for Project model."""

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Project]:
        """Get all projects for a specific user."""
        return (
            db.query(Project)
            .filter(Project.user_id == user_id)
            .order_by(Project.display_order.asc(), Project.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_featured(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 10,
        user_id: int | None = None
    ) -> List[Project]:
        """Get featured projects, optionally scoped to a user."""
        query = (
            db.query(Project)
            .filter(Project.featured == True)
        )
        if user_id:
            query = query.filter(Project.user_id == user_id)
        return (
            query.order_by(Project.display_order.asc(), Project.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_category(
        self,
        db: Session,
        *,
        category: str,
        skip: int = 0,
        limit: int = 100,
        user_id: int | None = None
    ) -> List[Project]:
        """Get projects by category."""
        query = db.query(Project).filter(Project.category == category)
        if user_id:
            query = query.filter(Project.user_id == user_id)
        return (
            query.order_by(Project.display_order.asc(), Project.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_user(
        self, db: Session, *, obj_in: ProjectCreate, user_id: int
    ) -> Project:
        """Create new project for a specific user."""
        obj_in_data = obj_in.dict()
        db_obj = Project(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


project = CRUDProject(Project)
