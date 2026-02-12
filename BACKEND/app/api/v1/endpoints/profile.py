"""
Profile endpoints - User profile management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_active_user
from app.crud import user as user_crud
from app.schemas.user import User, UserUpdate
from app.models.user import User as UserModel

router = APIRouter()


@router.get("/me", response_model=User)
def get_my_profile(
    current_user: UserModel = Depends(get_current_active_user)
) -> User:
    """Get current user profile."""
    return current_user


@router.put("/me", response_model=User)
def update_my_profile(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user)
) -> User:
    """Update current user profile."""
    user = user_crud.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/{user_id}", response_model=User)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
) -> User:
    """Get user profile by ID (public endpoint)."""
    user = user_crud.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
