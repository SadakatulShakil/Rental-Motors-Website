from fastapi import APIRouter, UploadFile, File, Form
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import Optional

router = APIRouter()

# SMTP Configuration
conf = ConnectionConfig(
    MAIL_USERNAME = "sadakatulshakil94@gmail.com", 
    MAIL_PASSWORD = "eqhpqqcbgqfzrsms",
    MAIL_FROM = "sadakatulshakil94@gmail.com", # Setup for a verified sender email
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,  # Use True here
    MAIL_SSL_TLS = False,  # Use False here
    USE_CREDENTIALS = True
)

@router.post("/admin/bookings/send-mail")
async def send_booking_mail(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    motorcycle: str = Form(...),
    startDate: str = Form(...),
    endDate: str = Form(...),
    licenseType: str = Form(...),
    hasCBT: str = Form(...),
    additionalInfo: Optional[str] = Form(None),
    license_front: Optional[UploadFile] = File(None),
    license_back: Optional[UploadFile] = File(None)
):
    html = f"""
    <div style="font-family: Arial; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #2563eb;">New ARP Motors Booking Request</h2>
        <hr/>
        <p><b>Vehicle:</b> {motorcycle}</p>
        <p><b>Dates:</b> {startDate} to {endDate}</p>
        <p><b>Customer:</b> {name} ({email})</p>
        <p><b>Contact:</b> {phone}</p>
        <p><b>License:</b> {licenseType} | <b>CBT:</b> {hasCBT}</p>
        <p><b>Notes:</b> {additionalInfo or "None"}</p>
    </div>
    """

    # Prepare attachments
    attachments = []
    for f in [license_front, license_back]:
        if f:
            # We must read content for fastapi-mail
            attachments.append(f)

    message = MessageSchema(
        subject=f"RENTAL REQUEST: {motorcycle} - {name}",
        recipients=["arperves@gmail.com"], # Set up for recipients email
        body=html,
        subtype="html",
        attachments=attachments
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    return {"status": "Email Sent"}