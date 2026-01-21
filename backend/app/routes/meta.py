from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db, engine
from ..models.ContentModel import PageMeta
from ..schemas import AdminSchemas as schemas

router = APIRouter(prefix="/admin/meta", tags=["Universal Meta"])

PageMeta.metadata.create_all(bind=engine)

@router.get("/{page_key}", response_model=schemas.PageMetaOut)
def get_meta(page_key: str, db: Session = Depends(get_db)):
    meta = db.query(PageMeta).filter(PageMeta.page_key == page_key).first()
    
    if not meta:
        # Create it in the DB immediately so it has a permanent record
        meta = PageMeta(
            page_key=page_key,
            header_title=f"{page_key.capitalize()} Title",
            header_image="",
            header_description="",
            page_title="",
            page_subtitle=""
        )
        db.add(meta)
        db.commit()
        db.refresh(meta)
        
    return meta

@router.put("/{page_key}")
def update_meta(page_key: str, data: schemas.PageMetaBase, db: Session = Depends(get_db)):
    meta = db.query(PageMeta).filter(PageMeta.page_key == page_key).first()
    
    # model_dump() is correct for Pydantic V2
    update_data = data.model_dump()
    
    if not meta:
        meta = PageMeta(page_key=page_key, **update_data)
        db.add(meta)
    else:
        for key, value in update_data.items():
            setattr(meta, key, value)
            
    db.commit()
    return {"message": f"Updated {page_key} meta successfully"}