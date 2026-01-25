from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from fastapi_mail import FastMail, MessageSchema
from ..models.ContactModel import ContactInfo, ContactField
from ..schemas.AdminSchemas import ContactInfoBase, ContactFieldCreate, ContactFieldOut, ContactInfoOut

router = APIRouter(prefix="/admin/contact", tags=["Contact"])

# --- CONTACT INFO ---
@router.get("/info", response_model=ContactInfoOut)
def get_contact_info(db: Session = Depends(get_db)):
    info = db.query(ContactInfo).first()
    if not info:
        # Initializing with actual numbers to prevent frontend NaN issues
        info = ContactInfo(
            address="Enter Address", 
            phone="000-000-0000", 
            email="admin@example.com", 
            latitude=0.0, 
            longitude=0.0
        )
        db.add(info)
        db.commit()
        db.refresh(info)
    return info

@router.put("/info", response_model=ContactInfoOut)
def update_contact_info(data: ContactInfoBase, db: Session = Depends(get_db)):
    info = db.query(ContactInfo).first()
    if not info:
        raise HTTPException(status_code=404, detail="Contact info record not found")
    
    # Use .dict() or .model_dump() (for Pydantic v2)
    update_data = data.dict()
    
    for key, value in update_data.items():
        # Safety check: if lat/lon comes as None or empty from frontend, 
        # you might want to default to 0.0 to avoid DB errors
        if (key == "latitude" or key == "longitude") and value is None:
            value = 0.0
        setattr(info, key, value)
    
    db.commit()
    db.refresh(info)
    return info

# --- FORM FIELDS ---
@router.get("/fields", response_model=List[ContactFieldOut])
def get_fields(db: Session = Depends(get_db)):
    # Sorting by ID ensures the form fields stay in the same order on the frontend
    return db.query(ContactField).order_by(ContactField.id.asc()).all()

@router.post("/fields", response_model=ContactFieldOut)
def add_field(data: ContactFieldCreate, db: Session = Depends(get_db)):
    new_field = ContactField(**data.dict())
    db.add(new_field)
    db.commit()
    db.refresh(new_field)
    return new_field

@router.delete("/fields/{field_id}")
def delete_field(field_id: int, db: Session = Depends(get_db)):
    field = db.query(ContactField).filter(ContactField.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    db.delete(field)
    db.commit()
    return {"status": "success", "message": f"Field {field_id} deleted"}