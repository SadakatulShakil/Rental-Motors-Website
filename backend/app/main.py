from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base # 🔹 Import engine and Base
from app.routes import admin, about, bikes, include, meta, gallery, contact, hero, stats, booking, contact_message, footer, chatbot
# Import all models here so Base knows about them
from app.models import BikeModel, ContentModel, AboutModel, IncludeModel, GalleryModel, ContactModel, HeroModel, FooterModel, ChatBotModel

app = FastAPI(title="ARP Motors API")

# 🔹 Add this line: It creates tables if they don't exist
Base.metadata.create_all(bind=engine)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Mount the static folder so uploaded images are viewable in the browser
# This makes http://localhost:8000/static/uploads/image.jpg work
app.mount("/static", StaticFiles(directory="static"), name="static")

# 2. Include your routers
app.include_router(admin.router)
app.include_router(about.router)
app.include_router(bikes.router)
app.include_router(include.router)
app.include_router(meta.router)
app.include_router(gallery.router)
app.include_router(contact.router)
app.include_router(hero.router)
app.include_router(stats.router)
app.include_router(booking.router)
app.include_router(contact_message.router)
app.include_router(footer.router)
app.include_router(chatbot.router)

@app.get("/main")
def root():
    return {"status": "API running"}