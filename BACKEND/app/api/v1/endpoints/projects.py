"""
Project endpoints - CRUD operations for portfolio projects.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_active_user, get_optional_user
from app.crud import project as project_crud
from app.schemas.project import Project, ProjectCreate, ProjectUpdate, ProjectList
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=ProjectList)
def get_projects(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    current_user: Optional[User] = Depends(get_optional_user)
) -> ProjectList:
    """Get all projects with optional filters."""
    if featured:
        projects = project_crud.project.get_featured(db, skip=skip, limit=limit)
    elif category:
        projects = project_crud.project.get_by_category(db, category=category, skip=skip, limit=limit)
    else:
        projects = project_crud.project.get_multi(db, skip=skip, limit=limit)
    
    total = project_crud.project.count(db)
    return ProjectList(projects=projects, total=total)


@router.get("/{project_id}", response_model=Project)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
) -> Project:
    """Get project by ID."""
    project = project_crud.project.get(db, id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project


@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(
    *,
    db: Session = Depends(get_db),
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_active_user)
) -> Project:
    """Create new project (authentication required)."""
    project = project_crud.project.create_with_user(
        db, obj_in=project_in, user_id=current_user.id
    )
    return project


@router.put("/{project_id}", response_model=Project)
def update_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Project:
    """Update project (authentication required)."""
    project = project_crud.project.get(db, id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    project = project_crud.project.update(db, db_obj=project, obj_in=project_in)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    current_user: User = Depends(get_current_active_user)
) -> None:
    """Delete project (authentication required)."""
    project = project_crud.project.get(db, id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    project_crud.project.remove(db, id=project_id)
