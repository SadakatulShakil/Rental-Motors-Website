from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Footer(Base):
    __tablename__ = "footer"

    id = Column(Integer, primary_key=True, index=True)
    site_title = Column(String, default="SKA MOTORS")
    logo_url = Column(String, nullable=True)
    slogan = Column(Text, nullable=True)
    sub_slogan = Column(Text, nullable=True)
    
    # Social Media Links
    facebook = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    instagram = Column(String, nullable=True)
    youtube = Column(String, nullable=True)