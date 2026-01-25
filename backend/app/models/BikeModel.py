from sqlalchemy import Column, Integer, String, Text, JSON
from app.database import Base

class Bike(Base):
    __tablename__ = "bikes"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    name = Column(String)
    price = Column(String)
    image = Column(String)
    cc = Column(String)
    fuel = Column(String)
    topSpeed = Column(String)
    description = Column(Text)
    
    # New Sketch Fields
    year_mf = Column(String)       # e.g., 2018
    fuel_use = Column(String)      # e.g., Octane
    color = Column(String)         # e.g., Deep Blue
    max_passengers = Column(Integer, default=2)
    transmission = Column(String)   # e.g., Automatic
    type = Column(String)           # e.g., Scooter
    
    # Dynamic Rental Charges (Stores the table data as a list of dicts)
    # [{"duration": "Daily", "charge": "100", "max_km": "-", "extra_charge": "-"}, ...]
    rental_charges = Column(JSON, nullable=True)