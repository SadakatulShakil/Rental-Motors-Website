from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database import Base

class ContactInfo(Base):
    __tablename__ = "contact_info"
    id = Column(Integer, primary_key=True)
    address = Column(String)
    phone = Column(String)
    email = Column(String)
    latitude = Column(Float, nullable=False, default=0.0)
    longitude = Column(Float, nullable=False, default=0.0)

class ContactField(Base):
    __tablename__ = "contact_form_fields"
    id = Column(Integer, primary_key=True)
    label = Column(String)       # e.g., "Your Name"
    field_type = Column(String)  # e.g., "text", "email", "textarea"
    is_required = Column(Boolean, default=True)