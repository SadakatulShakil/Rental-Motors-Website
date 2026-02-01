import os
import cloudinary
import cloudinary.uploader
from datetime import datetime, timedelta, timezone # 🛡️ Added timezone
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# Existing JWT Settings
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 365 * 60 * 24  # 1 year

# --- AUTH CONFIGURATION ---
# This was missing! It tells FastAPI where to look for the token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

# Setup Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Cloudinary Configuration ---
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
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Image Upload Function ---
def upload_image_to_cloud(file):
    try:
        # We use resource_type="auto" to handle images and potentially videos/files
        upload_result = cloudinary.uploader.upload(file, resource_type="auto")
        return upload_result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary Upload Error: {e}")
        return None


# --- Security Guard Function ---
async def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        
        if username is None:
            raise credentials_exception
            
        return {"username": username}
        
    except JWTError:
        raise credentials_exception