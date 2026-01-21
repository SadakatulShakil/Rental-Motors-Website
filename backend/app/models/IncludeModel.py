from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Feature(Base):
    __tablename__ = "features"
    id = Column(Integer, primary_key=True, index=True)
    icon_name = Column(String) # Store "FaMotorcycle", etc.
    title = Column(String)
    subtitle = Column(Text)

class Policy(Base):
    __tablename__ = "policies"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    points = Column(Text) # Store as a comma-separated string or JSON
    color_type = Column(String) # "orange" or "dark"