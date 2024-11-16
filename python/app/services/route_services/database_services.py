import os
from logger import logger

def cleanup_old_backups(backup_dir: str, keep_last: int = 10):
    """
    Removes old backups keeping only the most recent ones
    """
    try:
        # Get list of backup files
        backups = [f for f in os.listdir(backup_dir) if f.startswith('LocalDB_') and f.endswith('.db')]
        backups.sort(reverse=True)  # Sort newest to oldest
        
        # Remove old backups
        for backup in backups[keep_last:]:
            backup_path = os.path.join(backup_dir, backup)
            os.remove(backup_path)
            logger.info("Removed old backup: %s", backup_path)
            
    except Exception as e:
        logger.error("Error cleaning up old backups: %s", str(e))