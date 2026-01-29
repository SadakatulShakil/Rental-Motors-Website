import os
import cloudinary
import cloudinary.uploader
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

# Existing JWT Settings
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Setup Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Cloudinary Configuration ---
# These variables come from your Render Environment settings
cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET")
)

# --- Password Functions ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str):
    return pwd_context.hash(password)

# --- Token Functions ---
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Image Upload Function (NEW) ---
def upload_image_to_cloud(file):
    """
    Takes a file object and returns the permanent URL from Cloudinary.
    """
    try:
        upload_result = cloudinary.uploader.upload(file)
        return upload_result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary Upload Error: {e}")
        return None