from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
# Import both routers
from app.routes import admin, about, bikes
from app.models import BikeModel

app = FastAPI(title="ARP Motors API")

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

@app.get("/main")
def root():
    return {"status": "API running"}