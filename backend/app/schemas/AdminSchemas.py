from pydantic import BaseModel
from typing import List, Optional

# --- ADMIN USER SCHEMAS (Keep these) ---
class AdminUserCreate(BaseModel):
    username: str
    email: str
    password: str
    is_superuser: bool = False

class AdminUserOut(BaseModel):
    id: int
    username: str
    email: str
    is_superuser: bool

    class Config:
        from_attributes = True # Updated for Pydantic v2 (previously orm_mode = True)

# --- BIKE SCHEMAS (Add these) ---
class RentalCharge(BaseModel):
    duration: str
    charge: str
    max_km: str
    extra_charge: str

class BikeBase(BaseModel):
    name: str
    price: str
    image: str
    cc: str
    fuel: str
    topSpeed: str
    description: str
    slug: str
    # New fields from your sketch
    year_mf: Optional[str] = None
    fuel_use: Optional[str] = None
    color: Optional[str] = None
    max_passengers: Optional[int] = 2
    transmission: Optional[str] = None
    type: Optional[str] = None
    rental_charges: Optional[List[RentalCharge]] = None

class BikeCreate(BikeBase):
    pass

class BikeOut(BikeBase):
    id: int
    class Config:
        from_attributes = True # Allows Pydantic to read SQLAlchemy models
    id: int

    class Config:
        from_attributes = True

# --- GALLERY SCHEMAS ---
class GalleryBase(BaseModel):
    image: str
    description: Optional[str] = None
class GalleryCreate(GalleryBase):
    pass
class GalleryOut(GalleryBase):
    id: int
    class Config:
        from_attributes = True      
        
# --- ABOUT SCHEMAS ---
class AboutBase(BaseModel):
    description: str
    hero_image: str

class AboutUpdate(AboutBase):
    pass

class AboutOut(AboutBase):
    id: int
    class Config:
        from_attributes = True

# --- FEATURE SCHEMAS ---
class FeatureBase(BaseModel):
    icon_name: str
    title: str
    subtitle: str

class FeatureCreate(FeatureBase):
    pass

class FeatureOut(FeatureBase):
    id: int
    class Config:
        from_attributes = True

# --- POLICY SCHEMAS ---
class PolicyBase(BaseModel):
    title: str
    points: str 
    color_type: str

class PolicyCreate(PolicyBase):
    pass

class PolicyOut(PolicyBase):
    id: int
    class Config:
        from_attributes = True
        
# --- PAGE META SCHEMAS ---
class PageMetaBase(BaseModel):
    header_image: str
    header_title: str
    header_description: str
    page_title: str
    page_subtitle: str

class PageMetaOut(PageMetaBase):
    page_key: str
    class Config:
        from_attributes = True

# --- CONTACT INFO SCHEMAS ---
class ContactInfoBase(BaseModel):
    address: str
    phone: str
    email: str
    latitude: float
    longitude: float

class ContactInfoOut(ContactInfoBase):
    id: int
    class Config:
        from_attributes = True

# --- DYNAMIC FORM FIELD SCHEMAS ---
class ContactFieldBase(BaseModel):
    label: str
    field_type: str  # text, email, textarea, tel
    is_required: bool = True

class ContactFieldCreate(ContactFieldBase):
    pass

class ContactFieldOut(ContactFieldBase):
    id: int
    class Config:
        from_attributes = True

# --- HERO SLIDE SCHEMAS ---
class HeroSlideBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: str
    order: int = 0

class HeroSlideOut(HeroSlideBase):
    id: int
    class Config:
        from_attributes = True