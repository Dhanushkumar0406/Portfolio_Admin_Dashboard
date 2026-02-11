from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.experience import Experience
from app.schemas.experience import ExperienceCreate, ExperienceUpdate


class CRUDExperience(CRUDBase[Experience, ExperienceCreate, ExperienceUpdate]):
    """CRUD operations for Experience model."""

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Experience]:
        """Get all experience entries for a specific user."""
        return (
            db.query(Experience)
            .filter(Experience.user_id == user_id)
            .order_by(Experience.is_current.desc(), Experience.start_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_current(self, db: Session, *, user_id: int) -> List[Experience]:
        """Get current employment for a user."""
        return (
            db.query(Experience)
            .filter(Experience.user_id == user_id, Experience.is_current == True)
            .order_by(Experience.start_date.desc())
            .all()
        )

    def create_with_user(
        self, db: Session, *, obj_in: ExperienceCreate, user_id: int
    ) -> Experience:
        """Create new experience entry for a specific user."""
        obj_in_data = obj_in.dict()
        db_obj = Experience(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


experience = CRUDExperience(Experience)
