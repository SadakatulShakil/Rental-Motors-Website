from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.BikeModel import Bike  
from ..schemas import AdminSchemas as schemas
from ..utils import get_current_admin  # 🛡️ Your JWT guard

router = APIRouter(prefix="/admin", tags=["Bikes"])

@router.get("/bikes", response_model=list[schemas.BikeOut])
def get_bikes(db: Session = Depends(get_db)):
    return db.query(Bike).all()

@router.get("/bikes/{slug}", response_model=schemas.BikeOut)
def get_bike_by_slug(slug: str, db: Session = Depends(get_db)):
    db_bike = db.query(Bike).filter(Bike.slug == slug).first()
    if not db_bike:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_bike

# PROTECTED: CREATE
@router.post("/bikes", response_model=schemas.BikeOut, status_code=status.HTTP_201_CREATED)
def add_bike(
    bike: schemas.BikeCreate, 
    db: Session = Depends(get_db), 
    admin: dict = Depends(get_current_admin)
):
    # Ensure slug uniqueness
    if db.query(Bike).filter(Bike.slug == bike.slug).first():
        raise HTTPException(status_code=400, detail="Vehicle slug already exists")

    try:
        new_bike = Bike(**bike.model_dump())
        db.add(new_bike)
        db.commit()
        db.refresh(new_bike)
        return new_bike
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Server error during creation")

# PROTECTED: UPDATE
@router.put("/bikes/{slug}", response_model=schemas.BikeOut)
def update_bike(
    slug: str, 
    bike_data: schemas.BikeCreate, 
    db: Session = Depends(get_db), 
    admin: dict = Depends(get_current_admin)
):
    db_bike = db.query(Bike).filter(Bike.slug == slug).first()
    if not db_bike:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    for key, value in bike_data.model_dump().items():
        setattr(db_bike, key, value)

    try:
        db.commit()
        db.refresh(db_bike)
        return db_bike
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Update failed")

# PROTECTED: DELETE
@router.delete("/bikes/{slug}")
def delete_bike(
    slug: str, 
    db: Session = Depends(get_db), 
    admin: dict = Depends(get_current_admin)
):
    db_bike = db.query(Bike).filter(Bike.slug == slug).first()
    if not db_bike:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db.delete(db_bike)
    db.commit()
    return {"status": "success", "message": f"Deleted {slug}"}