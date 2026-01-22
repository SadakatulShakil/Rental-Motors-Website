from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import uuid

from ..database import get_db, engine
from ..models.GalleryModel import Gallery
from ..schemas.AdminSchemas import GalleryCreate, GalleryOut 

router = APIRouter(prefix="/admin/gallery", tags=["Gallery"])

# Ensure table exists
Gallery.metadata.create_all(bind=engine)

@router.get("/", response_model=List[GalleryOut])
def get_gallery(db: Session = Depends(get_db)):
    return db.query(Gallery).all()

@router.post("/upload")
async def upload_gallery_image(
    description: str = None, 
    image: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    upload_dir = "static/uploads/gallery"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Create unique filename to avoid overwriting
    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        url = f"http://localhost:8000/static/uploads/gallery/{unique_filename}"
        
        # Save to database
        new_item = Gallery(image=url, description=description)
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        
        return new_item
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.delete("/{image_id}")
def delete_gallery_image(image_id: int, db: Session = Depends(get_db)):
    item = db.query(Gallery).filter(Gallery.id == image_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Optional: Delete the physical file from storage
    try:
        # Extract filename from URL
        filename = item.image.split("/")[-1]
        file_path = os.path.join("static/uploads/gallery", filename)
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"File delete error: {e}")

    db.delete(item)
    db.commit()
    return {"message": "Image deleted successfully"}