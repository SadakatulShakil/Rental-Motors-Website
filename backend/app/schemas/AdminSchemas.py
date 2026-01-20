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