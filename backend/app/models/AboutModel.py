from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class About(Base):
    __tablename__ = "about_section"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text)
    hero_image = Column(String)