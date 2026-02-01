from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.ContactModel import ContactInfo, ContactField
from ..schemas.AdminSchemas import (
    ContactInfoBase, ContactFieldCreate, ContactFieldOut, ContactInfoOut
)
from ..utils import get_current_admin  # 🛡️ Protection

router = APIRouter(prefix="/admin/contact", tags=["Contact Management"])

# --- CONTACT INFO ---
@router.get("/info", response_model=ContactInfoOut)
def get_contact_info(db: Session = Depends(get_db)):
    info = db.query(ContactInfo).first()
    if not info:
        info = ContactInfo(
            address="Set Your Address", phone="000", email="admin@site.com", 
            latitude=0.0, longitude=0.0
        )
        db.add(info)
        db.commit()
        db.refresh(info)
    return info

@router.put("/info", response_model=ContactInfoOut)
def update_contact_info(
    data: ContactInfoBase, 
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    info = db.query(ContactInfo).first()
    if not info:
        raise HTTPException(status_code=404, detail="Info record missing")
    
    update_data = data.model_dump() # Pydantic v2
    for key, value in update_data.items():
        if (key in ["latitude", "longitude"]) and (value is None or value == ""):
            value = 0.0
        setattr(info, key, value)
    
    try:
        db.commit()
        db.refresh(info)
        return info
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database update failed")

# --- FORM FIELDS ---

@router.get("/fields", response_model=List[ContactFieldOut])
def get_fields(db: Session = Depends(get_db)):
    return db.query(ContactField).order_by(ContactField.id.asc()).all()

@router.post("/fields", response_model=ContactFieldOut, status_code=status.HTTP_201_CREATED)
def add_field(
    data: ContactFieldCreate, 
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    new_field = ContactField(**data.model_dump())
    db.add(new_field)
    db.commit()
    db.refresh(new_field)
    return new_field

@router.put("/fields/{field_id}", response_model=ContactFieldOut)
def update_field(
    field_id: int, 
    data: ContactFieldCreate, 
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    field = db.query(ContactField).filter(ContactField.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    
    for key, value in data.model_dump().items():
        setattr(field, key, value)
        
    db.commit()
    db.refresh(field)
    return field

@router.delete("/fields/{field_id}")
def delete_field(
    field_id: int, 
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    field = db.query(ContactField).filter(ContactField.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    db.delete(field)
    db.commit()
    return {"message": "Field deleted"}