from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.site_content import SiteContent
from app.schemas.site_content import SiteContentCreate, SiteContentUpdate


class CRUDSiteContent(CRUDBase[SiteContent, SiteContentCreate, SiteContentUpdate]):
    """CRUD operations for site content."""

    def get_active(self, db: Session, *, user_id: int | None = None) -> Optional[SiteContent]:
        """Get the currently active homepage content. Scoped to user if provided."""
        query = db.query(SiteContent).filter(SiteContent.is_active.is_(True))
        if user_id:
            query = query.filter(SiteContent.user_id == user_id)
        return (
            query.order_by(SiteContent.updated_at.desc().nullslast(), SiteContent.created_at.desc())
            .first()
        )

    def get_by_slug(self, db: Session, *, profile_slug: str) -> Optional[SiteContent]:
        """Get site content by profile slug."""
        return (
            db.query(SiteContent)
            .filter(SiteContent.profile_slug == profile_slug)
            .order_by(SiteContent.updated_at.desc().nullslast(), SiteContent.created_at.desc())
            .first()
        )

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[SiteContent]:
        """Get content items created by a specific user."""
        return (
            db.query(SiteContent)
            .filter(SiteContent.user_id == user_id)
            .order_by(SiteContent.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def deactivate_all(self, db: Session, *, user_id: int | None = None) -> None:
        """Set content rows inactive. If user_id provided, only that user's rows."""
        query = db.query(SiteContent)
        if user_id:
            query = query.filter(SiteContent.user_id == user_id)
        query.update({SiteContent.is_active: False})
        db.commit()

    def create_with_user(
        self, db: Session, *, obj_in: SiteContentCreate, user_id: int
    ) -> SiteContent:
        """Create content for user, preserving single active row when needed."""
        if obj_in.is_active:
            self.deactivate_all(db, user_id=user_id)

        obj_in_data = obj_in.dict()
        db_obj = SiteContent(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def set_active(self, db: Session, *, content_id: int) -> Optional[SiteContent]:
        """Activate one row and deactivate the rest for that user."""
        content = self.get(db, id=content_id)
        if not content:
            return None

        self.deactivate_all(db, user_id=content.user_id)
        content.is_active = True
        db.add(content)
        db.commit()
        db.refresh(content)
        return content


site_content = CRUDSiteContent(SiteContent)
