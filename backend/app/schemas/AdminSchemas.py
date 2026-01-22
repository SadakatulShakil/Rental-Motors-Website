from pydantic import BaseModel
from typing import Optional

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
class BikeBase(BaseModel):
    slug: str
    name: str
    price: str
    image: str
    cc: str
    fuel: str
    topSpeed: str
    description: str

class BikeCreate(BikeBase):
    pass  # This is used for POST requests

class BikeOut(BikeBase):
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