"""
Upload endpoints - Handle file uploads (images, 3D models, textures).
"""
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from app.api.deps import get_current_superuser
from app.models.user import User
from app.utils.file_handler import save_image, save_model, delete_file
from app.utils.model_validator import validate_3d_file, validate_texture_file

router = APIRouter()


@router.post("/image")
async def upload_image(
    *,
    file: UploadFile = File(...),
    category: str = "general",
    current_user: User = Depends(get_current_superuser)
) -> dict:
    """
    Upload image file.
    
    Args:
        file: Image file
        category: Upload category (projects, profile, etc.)
        current_user: Current authenticated user
        
    Returns:
        Upload result with file URL
    """
    file_path = await save_image(file, category)
    
    return {
        "message": "Image uploaded successfully",
        "file_path": file_path,
        "url": f"/uploads/{file_path}"
    }


@router.post("/model")
async def upload_model(
    *,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_superuser)
) -> dict:
    """
    Upload 3D model file.
    
    Args:
        file: 3D model file (.glb, .gltf, .fbx, .obj)
        current_user: Current authenticated user
        
    Returns:
        Upload result with file URL and model type
    """
    # Validate 3D model
    is_valid, model_type = validate_3d_file(file)
    
    # Save model
    file_path = await save_model(file)
    
    return {
        "message": "3D model uploaded successfully",
        "file_path": file_path,
        "url": f"/uploads/{file_path}",
        "model_type": model_type
    }


@router.post("/texture")
async def upload_texture(
    *,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_superuser)
) -> dict:
    """
    Upload texture file for 3D models.
    
    Args:
        file: Texture file (.jpg, .png, .exr, .hdr)
        current_user: Current authenticated user
        
    Returns:
        Upload result with file URL
    """
    # Validate texture
    validate_texture_file(file)
    
    # Save texture
    file_path = await save_image(file, "textures")
    
    return {
        "message": "Texture uploaded successfully",
        "file_path": file_path,
        "url": f"/uploads/{file_path}"
    }


@router.post("/skill-icon")
async def upload_skill_icon(
    *,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_superuser)
) -> dict:
    """
    Upload skill icon (SVG/PNG).
    
    Args:
        file: Icon file (.svg, .png)
        current_user: Current authenticated user
        
    Returns:
        Upload result with file URL and detected skill name
    """
    import os
    from pathlib import Path
    
    # Validate file type
    ext = Path(file.filename).suffix.lower()
    if ext not in [".svg", ".png"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only SVG and PNG files are allowed"
        )
    
    # Save icon
    file_path = await save_image(file, "skills")
    
    # Extract skill name from filename
    skill_name = Path(file.filename).stem.replace("-", " ").replace("_", " ").title()
    
    return {
        "message": "Skill icon uploaded successfully",
        "file_path": file_path,
        "url": f"/uploads/{file_path}",
        "detected_name": skill_name
    }


@router.delete("/file")
async def delete_uploaded_file(
    *,
    file_path: str,
    current_user: User = Depends(get_current_superuser)
) -> dict:
    """
    Delete uploaded file.
    
    Args:
        file_path: Relative file path to delete
        current_user: Current authenticated user
        
    Returns:
        Deletion result
    """
    success = delete_file(file_path)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found or already deleted"
        )
    
    return {
        "message": "File deleted successfully",
        "file_path": file_path
    }
