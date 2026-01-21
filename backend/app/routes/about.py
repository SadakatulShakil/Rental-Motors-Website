from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db, engine
from ..models.AboutModel import About
from ..schemas.AdminSchemas import AboutUpdate, AboutOut
import shutil
import os

router = APIRouter(prefix="/admin", tags=["About"])

# Create table if it doesn't exist
About.metadata.create_all(bind=engine)

@router.get("/about", response_model=AboutOut)
def get_about(db: Session = Depends(get_db)):
    # Try to get the first record
    about_data = db.query(About).first()
    if not about_data:
        # Create default data if the DB is empty
        # Note: We only include description and hero_image here
        about_data = About(
            description="Explore London with our premium motorcycle fleet. We provide the best service for riders.",
            hero_image="/hero-bg.jpg"
        )
        db.add(about_data)
        db.commit()
        db.refresh(about_data)
    return about_data

@router.put("/about")
def update_about(data: AboutUpdate, db: Session = Depends(get_db)):
    about_record = db.query(About).first()
    if not about_record:
        about_record = About()
        db.add(about_record)

    # 🔹 FIXED: Removed .title and .subtitle assignments
    # These caused the AttributeError because they aren't in AboutUpdate
    about_record.description = data.description
    about_record.hero_image = data.hero_image
    
    db.commit()
    return {"message": "Updated successfully"}

@router.post("/about/upload-image")
async def upload_image(image: UploadFile = File(...)):
    upload_dir = "static/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, image.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Ensure your frontend uses this URL correctly
        url = f"http://localhost:8000/static/uploads/{image.filename}"
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")