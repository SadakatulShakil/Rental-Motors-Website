import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db, engine
from ..models.AboutModel import About
from ..utils import upload_image_to_cloud
from ..schemas.AdminSchemas import AboutUpdate, AboutOut

router = APIRouter(prefix="/admin", tags=["About"])

# Create table if it doesn't exist
About.metadata.create_all(bind=engine)

@router.get("/about", response_model=AboutOut)
def get_about(db: Session = Depends(get_db)):
    # 1. Look for the brand story in Neon
    about_data = db.query(About).first()
    
    # 2. If nothing exists yet, create a default "Starter" record
    if not about_data:
        about_data = About(
            description="Welcome to Rental Motors. Our journey started with a passion for the open road...",
            hero_image="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" # A placeholder cloud URL
        )
        db.add(about_data)
        db.commit()
        db.refresh(about_data)
        
    # 3. Return the data (including the Cloudinary URL) to the frontend
    return about_data

@router.put("/about")
def update_about(data: AboutUpdate, db: Session = Depends(get_db)):
    # 1. Try to find the existing record
    about_record = db.query(About).first()

    # 2. If it doesn't exist (first time setup), create it
    if not about_record:
        about_record = About(
            description=data.description,
            hero_image=data.hero_image
        )
        db.add(about_record)
    else:
        # 3. Update the existing record with new data (Cloudinary URLs + Text)
        about_record.description = data.description
        about_record.hero_image = data.hero_image

    try:
        db.commit()
        db.refresh(about_record) # Syncs the object with the database
        return {
            "message": "About section updated successfully",
            "data": {
                "description": about_record.description,
                "hero_image": about_record.hero_image
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/about/upload-image")
async def upload_image(image: UploadFile = File(...)):
    try:
        # 1. Send the file directly to Cloudinary
        # We pass image.file (the actual data stream) to our utility
        cloud_url = upload_image_to_cloud(image.file)
        
        # 2. Check if the upload was successful
        if not cloud_url:
            raise HTTPException(status_code=500, detail="Failed to get URL from Cloudinary")
        
        # 3. Return the permanent HTTPS link to your frontend
        return {"url": cloud_url}

    except Exception as e:
        # Log the error for your own debugging in Render Logs
        print(f"Detailed Upload Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")