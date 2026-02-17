"""
Education endpoints - CRUD operations for education and certifications.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_active_user
from app.crud.base import CRUDBase
from app.crud import site_content as site_content_crud
from app.models.education import Education as EducationModel
from app.schemas.education import Education, EducationCreate, EducationUpdate, EducationList
from app.models.user import User

router = APIRouter()

# Create CRUD instance
education_crud = CRUDBase[EducationModel, EducationCreate, EducationUpdate](EducationModel)


@router.get("/", response_model=EducationList)
def get_educations(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    slug: str | None = Query(None, description="Profile slug filter"),
) -> EducationList:
    """Get all education entries."""
    if slug:
        content = site_content_crud.get_by_slug(db, profile_slug=slug)
        if not content:
            return EducationList(educations=[], total=0)
        educations = (
            db.query(EducationModel)
            .filter(EducationModel.user_id == content.user_id)
            .order_by(EducationModel.display_order.asc(), EducationModel.start_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        total = len(educations)
    else:
        educations = education_crud.get_multi(db, skip=skip, limit=limit)
        total = education_crud.count(db)
    return EducationList(educations=educations, total=total)


@router.get("/{education_id}", response_model=Education)
def get_education(
    education_id: int,
    db: Session = Depends(get_db)
) -> Education:
    """Get education by ID."""
    education = education_crud.get(db, id=education_id)
    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found"
        )
    return education


@router.post("/", response_model=Education, status_code=status.HTTP_201_CREATED)
def create_education(
    *,
    db: Session = Depends(get_db),
    education_in: EducationCreate,
    current_user: User = Depends(get_current_active_user)
) -> Education:
    """Create new education entry (authentication required)."""
    education_data = education_in.dict()
    education_data["user_id"] = current_user.id
    education = EducationModel(**education_data)
    db.add(education)
    db.commit()
    db.refresh(education)
    return education


@router.put("/{education_id}", response_model=Education)
def update_education(
    *,
    db: Session = Depends(get_db),
    education_id: int,
    education_in: EducationUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Education:
    """Update education (authentication required)."""
    education = education_crud.get(db, id=education_id)
    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found"
        )
    
    if education.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    education = education_crud.update(db, db_obj=education, obj_in=education_in)
    return education


@router.delete("/{education_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(
    *,
    db: Session = Depends(get_db),
    education_id: int,
    current_user: User = Depends(get_current_active_user)
) -> None:
    """Delete education (authentication required)."""
    education = education_crud.get(db, id=education_id)
    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found"
        )
    
    if education.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    education_crud.remove(db, id=education_id)
