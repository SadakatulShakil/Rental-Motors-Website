from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db, engine
from ..models.BikeModel import Bike  
from ..schemas import AdminSchemas as schemas

# This line ensures the 'bikes' table is actually created in Postgres
Bike.metadata.create_all(bind=engine)

router = APIRouter(prefix="/admin", tags=["Bikes"])

# 1. GET ALL BIKES
@router.get("/bikes", response_model=list[schemas.BikeOut])
def get_bikes(db: Session = Depends(get_db)):
    return db.query(Bike).all()

# 2. GET SINGLE BIKE BY SLUG (For the Details Page)
@router.get("/bikes/{slug}", response_model=schemas.BikeOut)
def get_bike_by_slug(slug: str, db: Session = Depends(get_db)):
    # 🔹 This is what your frontend [slug]/page.tsx calls
    db_bike = db.query(Bike).filter(Bike.slug == slug).first()
    if not db_bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    return db_bike

# 3. CREATE BIKE
@router.post("/bikes", response_model=schemas.BikeOut)
def add_bike(bike: schemas.BikeCreate, db: Session = Depends(get_db)):
    # Check if slug already exists to prevent Postgres errors
    existing_bike = db.query(Bike).filter(Bike.slug == bike.slug).first()
    if existing_bike:
        raise HTTPException(status_code=400, detail="A bike with this slug already exists")

    new_bike = Bike(**bike.model_dump()) # 🔹 .dict() is deprecated in Pydantic v2, use .model_dump()
    db.add(new_bike)
    db.commit()
    db.refresh(new_bike)
    return new_bike

# 4. DELETE BIKE
@router.delete("/bikes/{slug}")
def delete_bike(slug: str, db: Session = Depends(get_db)):
    db_bike = db.query(Bike).filter(Bike.slug == slug).first()
    if not db_bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    
    db.delete(db_bike)
    db.commit()
    return {"message": "Deleted successfully"}