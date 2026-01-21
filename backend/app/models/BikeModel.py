from sqlalchemy import Column, Integer, String, Text
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