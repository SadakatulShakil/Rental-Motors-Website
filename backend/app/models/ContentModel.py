from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class PageMeta(Base):
    __tablename__ = "page_meta"
    
    # We use page_key (e.g., 'about', 'bikes', 'include') as the unique identifier
    page_key = Column(String, primary_key=True, index=True)
    
    # --- Universal Header Section ---
    header_image = Column(String)
    header_title = Column(String)
    header_description = Column(String)
    
    # --- Universal Page Titles (The section below header) ---
    page_title = Column(String)
    page_subtitle = Column(String)