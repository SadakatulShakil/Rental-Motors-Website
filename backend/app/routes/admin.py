from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import get_db
from ..models.AdminUser import AdminUser
from ..utils import (
    verify_password, 
    create_access_token, 
    get_current_admin,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/admin", tags=["Authentication"])

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    # 1. Fetch user
    user = db.query(AdminUser).filter(AdminUser.username == form_data.username).first()
    
    # 2. Safety: Use a generic error message for both wrong user and wrong pass
    # This prevents "Username enumeration" (hackers figuring out valid usernames)
    auth_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise auth_exception

    # 3. Create Token with Expiry
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, 
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"username": user.username} # Helpful for the frontend UI
    }

# 4. Added "ME" route: This allows the frontend to check if a saved token is still valid
@router.get("/me")
async def get_admin_me(current_admin: dict = Depends(get_current_admin)):
    return current_admin