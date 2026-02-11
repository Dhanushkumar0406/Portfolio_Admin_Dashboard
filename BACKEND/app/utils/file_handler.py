"""
File handling utilities for uploads.
"""
import os
import uuid
import shutil
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException, status
from PIL import Image
from app.core.config import settings


def get_upload_path(category: str) -> Path:
    """
    Get upload path for a specific category.
    
    Args:
        category: Upload category (projects, profile, models, etc.)
        
    Returns:
        Path object for the upload directory
    """
    upload_path = Path(settings.UPLOAD_DIR) / category
    upload_path.mkdir(parents=True, exist_ok=True)
    return upload_path


def generate_unique_filename(original_filename: str) -> str:
    """
    Generate unique filename while preserving extension.
    
    Args:
        original_filename: Original file name
        
    Returns:
        Unique filename with original extension
    """
    ext = Path(original_filename).suffix
    unique_name = f"{uuid.uuid4()}{ext}"
    return unique_name


def validate_file_size(file: UploadFile, max_size: Optional[int] = None) -> None:
    """
    Validate file size.
    
    Args:
        file: Upload file
        max_size: Maximum file size in bytes
        
    Raises:
        HTTPException: If file size exceeds maximum
    """
    if max_size is None:
        max_size = settings.MAX_UPLOAD_SIZE
    
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {max_size / (1024*1024):.2f}MB"
        )


def validate_image_file(file: UploadFile) -> None:
    """
    Validate image file type and extension.
    
    Args:
        file: Upload file
        
    Raises:
        HTTPException: If file is not a valid image
    """
    ext = Path(file.filename).suffix.lower()
    if ext not in settings.ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image format. Allowed: {', '.join(settings.ALLOWED_IMAGE_EXTENSIONS)}"
        )


def validate_model_file(file: UploadFile) -> None:
    """
    Validate 3D model file type and extension.
    
    Args:
        file: Upload file
        
    Raises:
        HTTPException: If file is not a valid 3D model
    """
    ext = Path(file.filename).suffix.lower()
    if ext not in settings.ALLOWED_MODEL_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid 3D model format. Allowed: {', '.join(settings.ALLOWED_MODEL_EXTENSIONS)}"
        )


async def save_upload_file(
    file: UploadFile,
    category: str,
    validate_func: Optional[callable] = None
) -> str:
    """
    Save uploaded file to disk.
    
    Args:
        file: Upload file
        category: Upload category
        validate_func: Optional validation function
        
    Returns:
        Relative file path (e.g., "projects/uuid.jpg")
        
    Raises:
        HTTPException: If validation fails or save fails
    """
    # Validate file size
    validate_file_size(file)
    
    # Run custom validation if provided
    if validate_func:
        validate_func(file)
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    
    # Get upload path
    upload_path = get_upload_path(category)
    file_path = upload_path / unique_filename
    
    # Save file
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    finally:
        file.file.close()
    
    # Return relative path
    relative_path = f"{category}/{unique_filename}"
    return relative_path


async def save_image(file: UploadFile, category: str) -> str:
    """
    Save image file with validation.
    
    Args:
        file: Image file
        category: Upload category
        
    Returns:
        Relative file path
    """
    return await save_upload_file(file, category, validate_image_file)


async def save_model(file: UploadFile) -> str:
    """
    Save 3D model file with validation.
    
    Args:
        file: 3D model file
        
    Returns:
        Relative file path
    """
    return await save_upload_file(file, "models", validate_model_file)


def delete_file(file_path: str) -> bool:
    """
    Delete file from disk.
    
    Args:
        file_path: Relative file path
        
    Returns:
        True if file was deleted, False otherwise
    """
    try:
        full_path = Path(settings.UPLOAD_DIR) / file_path
        if full_path.exists():
            full_path.unlink()
            return True
        return False
    except Exception as e:
        print(f"Failed to delete file {file_path}: {str(e)}")
        return False


def create_thumbnail(
    image_path: str,
    thumbnail_path: str,
    size: tuple = (300, 300)
) -> None:
    """
    Create thumbnail from image.
    
    Args:
        image_path: Source image path
        thumbnail_path: Destination thumbnail path
        size: Thumbnail size (width, height)
    """
    try:
        full_image_path = Path(settings.UPLOAD_DIR) / image_path
        full_thumbnail_path = Path(settings.UPLOAD_DIR) / thumbnail_path
        
        full_thumbnail_path.parent.mkdir(parents=True, exist_ok=True)
        
        with Image.open(full_image_path) as img:
            img.thumbnail(size, Image.Resampling.LANCZOS)
            img.save(full_thumbnail_path, quality=85, optimize=True)
    except Exception as e:
        print(f"Failed to create thumbnail: {str(e)}")
