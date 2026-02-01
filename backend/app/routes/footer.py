from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from ..models.FooterModel import Footer
from ..schemas.AdminSchemas import FooterSettingsUpdate, FooterSettingsRead
import os
import shutil 

router = APIRouter(prefix="/admin", tags=["Footer Settings"])

@router.get("/footer", response_model=FooterSettingsRead)
def get_footer_settings(db: Session = Depends(get_db)):
    settings = db.query(Footer).first()
    if not settings:
        # Create default entry if none exists
        new_settings = Footer(site_title="ARP MOTORS")
        db.add(new_settings)
        db.commit()
        db.refresh(new_settings)
        return new_settings
    return settings

@router.put("/footer/upload-logo")
async def upload_footer_logo(file: UploadFile = File(...)):
    try:
        # 1. Use your utility function (ensure it's imported)
        # Assuming upload_image_to_cloud is in your utils
        cloud_url = upload_image_to_cloud(file.file)
        
        # 2. Check if the upload was successful
        if not cloud_url:
            raise HTTPException(status_code=500, detail="Failed to get URL from Cloudinary")
        
        # 3. Return the key "url" to match your other upload routes
        return {"url": cloud_url}

    except Exception as e:
        print(f"Footer Logo Upload Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    

@router.put("/footer", response_model=FooterSettingsRead)
def update_footer_settings(obj_in: FooterSettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(Footer).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    update_data = obj_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(settings, field, update_data[field])
    
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings