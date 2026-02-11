"""
3D Assets endpoints - CRUD operations for Three.js configurations.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_active_user
from app.crud.base import CRUDBase
from app.models.three_config import ThreeConfig as ThreeConfigModel
from app.schemas.three_config import ThreeConfig, ThreeConfigCreate, ThreeConfigUpdate, ThreeConfigList
from app.models.user import User

router = APIRouter()

# Create CRUD instance
three_config_crud = CRUDBase[ThreeConfigModel, ThreeConfigCreate, ThreeConfigUpdate](ThreeConfigModel)


@router.get("/", response_model=ThreeConfigList)
def get_three_configs(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    scene_type: str = None
) -> ThreeConfigList:
    """Get all 3D configurations."""
    if scene_type:
        configs = db.query(ThreeConfigModel).filter(
            ThreeConfigModel.scene_type == scene_type
        ).offset(skip).limit(limit).all()
    else:
        configs = three_config_crud.get_multi(db, skip=skip, limit=limit)
    
    total = three_config_crud.count(db)
    return ThreeConfigList(configs=configs, total=total)


@router.get("/by-scene/{scene_name}", response_model=ThreeConfig)
def get_three_config_by_scene(
    scene_name: str,
    db: Session = Depends(get_db)
) -> ThreeConfig:
    """Get 3D configuration by scene name."""
    config = db.query(ThreeConfigModel).filter(
        ThreeConfigModel.scene_name == scene_name
    ).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Configuration for scene '{scene_name}' not found"
        )
    return config


@router.get("/{config_id}", response_model=ThreeConfig)
def get_three_config(
    config_id: int,
    db: Session = Depends(get_db)
) -> ThreeConfig:
    """Get 3D configuration by ID."""
    config = three_config_crud.get(db, id=config_id)
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuration not found"
        )
    return config


@router.post("/", response_model=ThreeConfig, status_code=status.HTTP_201_CREATED)
def create_three_config(
    *,
    db: Session = Depends(get_db),
    config_in: ThreeConfigCreate,
    current_user: User = Depends(get_current_active_user)
) -> ThreeConfig:
    """Create new 3D configuration (authentication required)."""
    # Check if scene name already exists
    existing = db.query(ThreeConfigModel).filter(
        ThreeConfigModel.scene_name == config_in.scene_name
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Configuration for scene '{config_in.scene_name}' already exists"
        )
    
    config_data = config_in.dict()
    config_data["user_id"] = current_user.id
    config = ThreeConfigModel(**config_data)
    db.add(config)
    db.commit()
    db.refresh(config)
    return config


@router.put("/{config_id}", response_model=ThreeConfig)
def update_three_config(
    *,
    db: Session = Depends(get_db),
    config_id: int,
    config_in: ThreeConfigUpdate,
    current_user: User = Depends(get_current_active_user)
) -> ThreeConfig:
    """Update 3D configuration (authentication required)."""
    config = three_config_crud.get(db, id=config_id)
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuration not found"
        )
    
    if config.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    config = three_config_crud.update(db, db_obj=config, obj_in=config_in)
    return config


@router.delete("/{config_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_three_config(
    *,
    db: Session = Depends(get_db),
    config_id: int,
    current_user: User = Depends(get_current_active_user)
) -> None:
    """Delete 3D configuration (authentication required)."""
    config = three_config_crud.get(db, id=config_id)
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuration not found"
        )
    
    if config.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    three_config_crud.remove(db, id=config_id)
