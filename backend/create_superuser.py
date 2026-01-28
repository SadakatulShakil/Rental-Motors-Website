import os
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

    # Ensure tables exist in Neon
    Base.metadata.create_all(bind=engine)

    print("--- Creating Superuser for Production ---")
    
    # It pulls these from Render "Environment" variables
    username = os.getenv("ADMIN_USERNAME", "admin")
    email = os.getenv("ADMIN_EMAIL", "admin@example.com")
    password = os.getenv("ADMIN_PASSWORD")

    if not password:
        print("❌ Error: ADMIN_PASSWORD Environment Variable is not set!")
        return

    try:
        # Check if user already exists
        user_exists = db.query(AdminUser).filter(AdminUser.email == email).first()
        if user_exists:
            print(f"ℹ️ Admin with email {email} already exists. Skipping.")
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