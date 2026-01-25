from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.HeroModel import HeroSlide
from ..schemas.AdminSchemas import HeroSlideBase, HeroSlideOut

router = APIRouter(prefix="/admin/hero", tags=["Hero Slider"])

@router.get("/slides", response_model=List[HeroSlideOut])
def get_slides(db: Session = Depends(get_db)):
    return db.query(HeroSlide).order_by(HeroSlide.order.asc()).all()

@router.post("/slides", response_model=HeroSlideOut)
def add_slide(data: HeroSlideBase, db: Session = Depends(get_db)):
    new_slide = HeroSlide(**data.model_dump())
    db.add(new_slide)
    db.commit()
    db.refresh(new_slide)
    return new_slide

@router.put("/slides/{slide_id}", response_model=HeroSlideOut)
def update_slide(slide_id: int, data: HeroSlideBase, db: Session = Depends(get_db)):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    
    # Update fields
    for key, value in data.model_dump().items():
        setattr(slide, key, value)
    
    db.commit()
    db.refresh(slide)
    return slide
    
@router.delete("/slides/{slide_id}")
def delete_slide(slide_id: int, db: Session = Depends(get_db)):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    db.delete(slide)
    db.commit()
    return {"message": "Slide deleted"}