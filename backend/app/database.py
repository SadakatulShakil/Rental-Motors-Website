import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load local .env file if it exists (for local testing)
load_dotenv()

# 1. Get the URL from Environment Variables 
# Render will provide this via the 'DATABASE_URL' key you set in the dashboard
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Cleanup the URL (Removes 'psql' prefix or single quotes if they exist)
if DATABASE_URL:
    # Remove 'psql ' and any surrounding quotes if accidentally pasted
    DATABASE_URL = DATABASE_URL.replace("psql ", "").replace("'", "").strip()
    
    # SQLAlchemy requires 'postgresql://', but some providers give 'postgres://'
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    # Fallback for local development if no variable is found
    DATABASE_URL = "postgresql://user:password@localhost/db_name"

# 3. Create the Engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()