from app.database import SessionLocal, engine, Base
from app.models.AdminUser import AdminUser
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

# Setup Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def create_superuser():
    db = SessionLocal()

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    print("--- Create Superuser for FastAPI ---")
    
    username = input("Enter username: ")
    email = input("Enter email: ")import os
from app.database import SessionLocal, engine, Base
from app.models.AdminUser import AdminUser
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def create_superuser():
    db = SessionLocal()
    Base.metadata.create_all(bind=engine)

    # Use environment variables instead of input()
    username = os.getenv("ADMIN_USERNAME", "admin")
    email = os.getenv("ADMIN_EMAIL", "admin@example.com")
    password = os.getenv("123456")

    if not password:
        print("❌ Error: ADMIN_PASSWORD environment variable not set.")
        return

    try:
        # Check if user already exists to avoid errors
        existing_user = db.query(AdminUser).filter(AdminUser.email == email).first()
        if existing_user:
            print(f"ℹ️ Admin '{email}' already exists. Skipping.")
            return

        new_superuser = AdminUser(
            username=username,
            email=email,
            hashed_password=hash_password(password),
            is_superuser=True
        )

        db.add(new_superuser)
        db.commit()
        print(f"✅ Superuser '{username}' created successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_superuser()
    password = input("Enter password: ")

    try:
        new_superuser = AdminUser(
            username=username,
            email=email,
            hashed_password=hash_password(password),
            is_superuser=True
        )

        db.add(new_superuser)
        db.commit()
        db.refresh(new_superuser)
        print(f"✅ Superuser '{username}' created successfully!")

    except IntegrityError:
        print("❌ Error: A user with that username or email already exists.")
        db.rollback()
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_superuser()