from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.IncludeModel import Feature, Policy
from ..schemas.AdminSchemas import FeatureCreate, FeatureOut, PolicyCreate, PolicyOut
from ..utils import get_current_admin 

router = APIRouter(prefix="/admin/include", tags=["Include"])

# --- FEATURES API ---
@router.get("/features", response_model=list[FeatureOut])
def get_features(db: Session = Depends(get_db)):
    return db.query(Feature).all()

@router.post("/features", response_model=FeatureOut, status_code=status.HTTP_201_CREATED)
def add_feature(data: FeatureCreate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    new_feat = Feature(**data.model_dump())
    db.add(new_feat)
    db.commit()
    db.refresh(new_feat)
    return new_feat

@router.put("/features/{id}", response_model=FeatureOut)
def update_feature(id: int, data: FeatureCreate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    feature = db.query(Feature).filter(Feature.id == id).first()
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    for key, value in data.model_dump().items():
        setattr(feature, key, value)
    db.commit()
    db.refresh(feature)
    return feature

@router.delete("/features/{id}")
def delete_feature(id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    feature = db.query(Feature).filter(Feature.id == id).first()
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    db.delete(feature)
    db.commit()
    return {"message": "Feature removed"}

# --- POLICIES API ---
@router.get("/policies", response_model=list[PolicyOut])
def get_policies(db: Session = Depends(get_db)):
    return db.query(Policy).all()

@router.post("/policies", response_model=PolicyOut, status_code=status.HTTP_201_CREATED)
def add_policy(data: PolicyCreate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    new_policy = Policy(**data.model_dump())
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    return new_policy

@router.put("/policies/{id}", response_model=PolicyOut)
def update_policy(id: int, data: PolicyCreate, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    policy = db.query(Policy).filter(Policy.id == id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    for key, value in data.model_dump().items():
        setattr(policy, key, value)
    db.commit()
    db.refresh(policy)
    return policy

@router.delete("/policies/{id}")
def delete_policy(id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    policy = db.query(Policy).filter(Policy.id == id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    db.delete(policy)
    db.commit()
    return {"message": "Policy card removed"}