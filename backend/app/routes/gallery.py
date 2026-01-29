from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.GalleryModel import Gallery
from ..schemas.AdminSchemas import GalleryOut 
from ..utils import get_current_admin, upload_image_to_cloud # 🛡️ Use your cloud helper

router = APIRouter(prefix="/admin/gallery", tags=["Gallery"])

@router.get("/", response_model=List[GalleryOut])
def get_gallery(db: Session = Depends(get_db)):
    return db.query(Gallery).all()

@router.post("/upload", response_model=GalleryOut, status_code=status.HTTP_201_CREATED)
async def upload_gallery_image(
    description: str = None, 
    file: UploadFile = File(...), # 🔹 Changed parameter name to 'file' for utility consistency
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin) # 🔒 Protected
):
    try:
        # 1. Upload to Cloudinary instead of local folder
        image_url = upload_image_to_cloud(file.file)
        
        if not image_url:
            raise HTTPException(status_code=500, detail="Cloudinary upload failed")
        
        # 2. Save the Cloudinary URL to the database
        new_item = Gallery(image=image_url, description=description)
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        
        return new_item
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gallery upload failed: {str(e)}")

@router.delete("/{image_id}")
def delete_gallery_image(
    image_id: int, 
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin) # 🔒 Protected
):
    item = db.query(Gallery).filter(Gallery.id == image_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Image not found in gallery")
    
    # We delete from DB. (Optional: You could also call cloudinary.uploader.destroy here)
    db.delete(item)
    db.commit()
    return {"message": "Gallery item removed"}