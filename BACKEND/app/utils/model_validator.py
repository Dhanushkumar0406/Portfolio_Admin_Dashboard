"""
3D model validation utilities.
"""
import struct
from pathlib import Path
from typing import Tuple
from fastapi import UploadFile, HTTPException, status


def validate_glb_file(file: UploadFile) -> bool:
    """
    Validate GLB (binary GLTF) file format.
    
    Args:
        file: Upload file
        
    Returns:
        True if valid GLB file
        
    Raises:
        HTTPException: If file is invalid
    """
    try:
        # Read first 12 bytes (GLB header)
        file.file.seek(0)
        header = file.file.read(12)
        file.file.seek(0)
        
        if len(header) < 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid GLB file: File too small"
            )
        
        # Check magic number (should be 'glTF' = 0x46546C67)
        magic = struct.unpack('<I', header[0:4])[0]
        if magic != 0x46546C67:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid GLB file: Wrong magic number"
            )
        
        # Check version (should be 2)
        version = struct.unpack('<I', header[4:8])[0]
        if version != 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported GLB version: {version}"
            )
        
        return True
        
    except struct.error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GLB file: Corrupted header"
        )


def get_file_size_mb(file: UploadFile) -> float:
    """
    Get file size in megabytes.
    
    Args:
        file: Upload file
        
    Returns:
        File size in MB
    """
    file.file.seek(0, 2)
    size_bytes = file.file.tell()
    file.file.seek(0)
    return size_bytes / (1024 * 1024)


def validate_model_size(file: UploadFile, max_size_mb: float = 50.0) -> None:
    """
    Validate 3D model file size.
    
    Args:
        file: Upload file
        max_size_mb: Maximum file size in MB
        
    Raises:
        HTTPException: If file is too large
    """
    size_mb = get_file_size_mb(file)
    if size_mb > max_size_mb:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Model file too large: {size_mb:.2f}MB (max: {max_size_mb}MB)"
        )


def validate_texture_file(file: UploadFile) -> bool:
    """
    Validate texture file (image file for 3D models).
    
    Args:
        file: Upload file
        
    Returns:
        True if valid texture file
        
    Raises:
        HTTPException: If file is invalid
    """
    ext = Path(file.filename).suffix.lower()
    valid_extensions = {'.jpg', '.jpeg', '.png', '.exr', '.hdr'}
    
    if ext not in valid_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid texture format. Allowed: {', '.join(valid_extensions)}"
        )
    
    return True


def validate_3d_file(file: UploadFile) -> Tuple[bool, str]:
    """
    Validate 3D model file based on extension.
    
    Args:
        file: Upload file
        
    Returns:
        Tuple of (is_valid, file_type)
        
    Raises:
        HTTPException: If validation fails
    """
    ext = Path(file.filename).suffix.lower()
    
    # Validate file size
    validate_model_size(file)
    
    # Validate based on extension
    if ext == '.glb':
        validate_glb_file(file)
        return True, 'glb'
    elif ext == '.gltf':
        return True, 'gltf'
    elif ext == '.fbx':
        return True, 'fbx'
    elif ext == '.obj':
        return True, 'obj'
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported 3D model format: {ext}"
        )
