from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Gallery(Base):
    __tablename__ = "gallery"

    id = Column(Integer, primary_key=True, index=True)
    image = Column(String)
    description = Column(Text)