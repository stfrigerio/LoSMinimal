import os
from datetime import datetime
from pathlib import Path
import hashlib
from typing import Tuple, List

from logger import logger
from app.config import IMAGE_LIBRARY_PATH

def get_month_name(date_str: str) -> str:
    """Get full month name from date string."""
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return date.strftime('%B')  # Full month name
    except ValueError as e:
        logger.error(f"Invalid date format: {date_str}")
        raise ValueError(f"Invalid date format: {date_str}") from e

def get_next_filename(month: str, date_str: str) -> str:
    """Get next available filename for the given date."""
    month_path = Path(IMAGE_LIBRARY_PATH) / month
    month_path.mkdir(parents=True, exist_ok=True)

    existing_files = [f for f in month_path.glob(f"{date_str}_*.jpg")]
    numbers = [int(f.stem.split('_')[-1]) for f in existing_files if f.stem.split('_')[-1].isdigit()]
    next_number = max(numbers, default=0) + 1
    
    return f"{date_str}_{next_number}.jpg"

def get_image_hash(image) -> str:
    """Calculate SHA-256 hash of image content."""
    image.seek(0)  # Reset file pointer to beginning
    content = image.read()
    image.seek(0)  # Reset file pointer again for later use
    return hashlib.sha256(content).hexdigest()

def is_duplicate(image, month: str) -> Tuple[bool, str]:
    """Check if image is duplicate in the given month folder."""
    current_hash = get_image_hash(image)
    month_path = Path(IMAGE_LIBRARY_PATH) / month
    
    if not month_path.exists():
        return False, ""
    
    # Check hash against all existing images in the month folder
    for existing_file in month_path.glob("*.jpg"):
        with open(existing_file, 'rb') as f:
            if current_hash == hashlib.sha256(f.read()).hexdigest():
                return True, str(existing_file)
    return False, ""

def save_images(date_str: str, images) -> Tuple[List[str], int]:
    saved_images = []
    duplicates = 0
    
    month = get_month_name(date_str)
    
    for image in images:
        try:
            if not allowed_file(image.filename):
                logger.error(f"Unsupported file type: {image.filename}")
                continue
            
            # Check for duplicates
            is_dup, existing_path = is_duplicate(image, month)
            if is_dup:
                logger.info(f"Duplicate image found: {existing_path}")
                duplicates += 1
                continue
                
            filename = get_next_filename(month, date_str)
            save_path = os.path.join(IMAGE_LIBRARY_PATH, month, filename)
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            
            image.save(save_path)
            logger.info(f"Saved image to: {save_path}")
            saved_images.append(save_path)
        except Exception as e:
            logger.error(f"Failed to save image {image.filename}: {e}")
    
    return saved_images, duplicates

def allowed_file(filename):
    allowed_extensions = {'jpg', 'jpeg', 'png', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions