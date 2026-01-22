from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.BikeModel import Bike
from app.models.GalleryModel import Gallery
from app.models.HeroModel import HeroSlide
from app.models.AdminUser import AdminUser

router = APIRouter(prefix="/admin/stats", tags=["Dashboard"])

@router.get("/")
def get_dashboard_stats(db: Session = Depends(get_db)):
    return {
        "total_bikes": db.query(Bike).count(),
        "gallery_images": db.query(Gallery).count(),
        "hero_slides": db.query(HeroSlide).count(),
        "total_admins": db.query(AdminUser).count(),
    }