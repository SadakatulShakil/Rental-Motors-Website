from sqlalchemy import Column, Integer, String
from ..database import Base

class ChatOption(Base):
    __tablename__ = "chat_options"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String)         # The button text (e.g., "Price")
    icon_name = Column(String)     # The Lucide icon key (e.g., "PoundSterling")
    reply_text = Column(String)    # What the bot says back