from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate


class CRUDSkill(CRUDBase[Skill, SkillCreate, SkillUpdate]):
    """CRUD operations for Skill model."""

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Skill]:
        """Get all skills for a specific user."""
        return (
            db.query(Skill)
            .filter(Skill.user_id == user_id)
            .order_by(Skill.display_order.asc(), Skill.proficiency.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_category(
        self, db: Session, *, user_id: int, category: str
    ) -> List[Skill]:
        """Get skills by category for a user."""
        return (
            db.query(Skill)
            .filter(Skill.user_id == user_id, Skill.category == category)
            .order_by(Skill.display_order.asc(), Skill.proficiency.desc())
            .all()
        )

    def create_with_user(
        self, db: Session, *, obj_in: SkillCreate, user_id: int
    ) -> Skill:
        """Create new skill for a specific user."""
        obj_in_data = obj_in.dict()
        db_obj = Skill(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


skill = CRUDSkill(Skill)
