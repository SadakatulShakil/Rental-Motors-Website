from sqlalchemy import Column, Integer, String
from ..database import Base

class HeroSlide(Base):
    __tablename__ = "hero_slides"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    order = Column(Integer, default=0) # To control which slide shows first