from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
import shutil
import os

router = APIRouter(prefix="/admin", tags=["About"])

# 🔹 1. DEFINE mock_db HERE so the functions can find it
mock_db = {
    "title": "About ARP Motors",
    "subtitle": "Rental Service With A Wide Range Of Vehicles",
    "description": "For every destination you have in mind...",
    "hero_image": "/hero-bg.jpg"
}

class AboutData(BaseModel):
    title: str
    subtitle: str
    description: str

@router.get("/about")
async def get_about():
    # Now mock_db exists, so this won't throw a NameError
    return mock_db

@router.put("/about")
async def update_about(data: AboutData):
    # 🔹 2. Update the actual mock_db dictionary keys
    mock_db["title"] = data.title
    mock_db["subtitle"] = data.subtitle
    mock_db["description"] = data.description
    return {"message": "Updated successfully", "data": mock_db}

@router.post("/about/upload-image")
async def upload_image(image: UploadFile = File(...)):
    upload_dir = "static/uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    file_path = os.path.join(upload_dir, image.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    url = f"http://localhost:8000/static/uploads/{image.filename}"
    
    return {"url": url}