import sys
import os

# This ensures the script can find your 'app' folder
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models.AdminUser import AdminUser
from app.utils import hash_password

def setup():
    db = SessionLocal()
    try:
        # Configuration
        username = "admin"
        password = "123456"
        email = "admin@arpmotors.com"

        print(f"Checking if user '{username}' exists...")
        user = db.query(AdminUser).filter(AdminUser.username == username).first()

        if not user:
            print(f"No user found. Creating super admin...")
            new_admin = AdminUser(
                username=username,
                email=email,
                hashed_password=hash_password(password),
                is_superuser=True
            )
            db.add(new_admin)
            db.commit()
            print("Successfully created!")
        else:
            print(f"User '{username}' already exists. Updating password instead.")
            user.hashed_password = hash_password(password)
            user.is_superuser = True
            db.commit()
            print("Password updated successfully!")

        # Final Verification Check
        all_users = db.query(AdminUser).all()
        print("\n--- Current Database State ---")
        for u in all_users:
            print(f"ID: {u.id} | User: {u.username} | Super: {u.is_superuser}")
            
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    setup()