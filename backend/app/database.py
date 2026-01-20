from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# postgresql://user:password@localhost:port/db_name
# Change "shakil" to your actual Mac username if it's different
SQLALCHEMY_DATABASE_URL = "postgresql://shakil@localhost:5432/arpmotors_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()