from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.HeroModel import HeroSlide
from ..schemas.AdminSchemas import HeroSlideBase, HeroSlideOut
from ..utils import get_current_admin

router = APIRouter(prefix="/admin/hero", tags=["Hero Slider"])

# Public/Admin GET: Anyone can view the slides (usually needed for the homepage)
@router.get("/slides", response_model=List[HeroSlideOut])
def get_slides(db: Session = Depends(get_db)):
    return db.query(HeroSlide).order_by(HeroSlide.order.asc()).all()

# PROTECTED: Add Slide
@router.post("/slides", response_model=HeroSlideOut, status_code=status.HTTP_201_CREATED)
def add_slide(
    data: HeroSlideBase, 
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin) # Protection
):
    try:
        new_slide = HeroSlide(**data.model_dump())
        db.add(new_slide)
        db.commit()
        db.refresh(new_slide)
        return new_slide
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create slide")

# PROTECTED: Update Slide
@router.put("/slides/{slide_id}", response_model=HeroSlideOut)
def update_slide(
    slide_id: int, 
    data: HeroSlideBase, 
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin) # Protection
):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide asset not found")
    
    # Efficient update
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(slide, key, value)
    
    try:
        db.commit()
        db.refresh(slide)
        return slide
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Update failed")

# PROTECTED: Delete Slide
@router.delete("/slides/{slide_id}", status_code=status.HTTP_200_OK)
def delete_slide(
    slide_id: int, 
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin) # Protection
):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide already removed")
    
    try:
        db.delete(slide)
        db.commit()
        return {"message": f"Slide {slide_id} successfully deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Delete failed")