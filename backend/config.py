import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017"
)

DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "deepverify_ai"
)

# Uploads
UPLOAD_FOLDER = "uploads"

# Reports
REPORT_FOLDER = "reports"

# Temporary Files
TEMP_FOLDER = "temp"

# History
HISTORY_FOLDER = "history"

# Maximum Upload Size (100 MB)
MAX_FILE_SIZE = 100 * 1024 * 1024

# Allowed Extensions
ALLOWED_VIDEO = [
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".webm"
]

ALLOWED_AUDIO = [
    ".wav",
    ".mp3",
    ".m4a"
]

ALLOWED_IMAGE = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
]