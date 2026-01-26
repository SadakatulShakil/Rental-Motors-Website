from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db, engine
from ..models.ChatBotModel import ChatOption
from ..schemas.AdminSchemas import ChatOptionOut, ChatOptionCreate

router = APIRouter(prefix="/admin/chatbot", tags=["Chatbot"])

# Create table if it doesn't exist
ChatOption.metadata.create_all(bind=engine)

@router.get("/options", response_model=List[ChatOptionOut])
def get_chat_options(db: Session = Depends(get_db)):
    options = db.query(ChatOption).all()
    if not options:
        # Create a default option if none exist
        default_opt = ChatOption(
            label="Pricing",
            icon_name="PoundSterling",
            reply_text="Our rentals start from £40 per day. Long-term deals available!"
        )
        db.add(default_opt)
        db.commit()
        db.refresh(default_opt)
        return [default_opt]
    return options

@router.put("/options/bulk")
def update_chatbot_options(data: List[ChatOptionCreate], db: Session = Depends(get_db)):
    try:
        # 1. Clear the current options
        db.query(ChatOption).delete()
        
        # 2. Add the new ones from the list
        for item in data:
            new_opt = ChatOption(
                label=item.label,
                icon_name=item.icon_name,
                reply_text=item.reply_text
            )
            db.add(new_opt)
        
        db.commit()
        return {"message": "Chatbot options updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update chatbot: {str(e)}")