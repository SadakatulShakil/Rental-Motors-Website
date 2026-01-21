from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db, engine
from ..models.IncludeModel import Feature, Policy
from ..schemas.AdminSchemas import FeatureCreate, FeatureOut, PolicyCreate, PolicyOut

router = APIRouter(prefix="/admin/include", tags=["Include"])

# Create tables
Feature.metadata.create_all(bind=engine)
Policy.metadata.create_all(bind=engine)

# --- FEATURES API ---
@router.get("/features", response_model=list[FeatureOut])
def get_features(db: Session = Depends(get_db)):
    return db.query(Feature).all()

@router.post("/features")
def add_feature(data: FeatureCreate, db: Session = Depends(get_db)):
    new_feat = Feature(**data.model_dump())
    db.add(new_feat)
    db.commit()
    return new_feat

@router.delete("/features/{id}")
def delete_feature(id: int, db: Session = Depends(get_db)):
    db.query(Feature).filter(Feature.id == id).delete()
    db.commit()
    return {"message": "Deleted"}

# --- POLICIES API ---
@router.get("/policies", response_model=list[PolicyOut])
def get_policies(db: Session = Depends(get_db)):
    return db.query(Policy).all()

@router.post("/policies")
def add_policy(data: PolicyCreate, db: Session = Depends(get_db)):
    new_policy = Policy(**data.model_dump())
    db.add(new_policy)
    db.commit()
    return new_policy