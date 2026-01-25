from fastapi import APIRouter, Request, HTTPException
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os

router = APIRouter()

# SMTP Configuration
contact_conf= ConnectionConfig(
    MAIL_USERNAME = "sadakatulshakil94@gmail.com", 
    MAIL_PASSWORD = "eqhpqqcbgqfzrsms",
    MAIL_FROM = "sadakatulshakil94@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True
)

@router.post("/admin/contact/send-mail")
async def send_contact_mail(request: Request):
    try:
        # 1. Get the dynamic JSON data from the Contact Page
        data = await request.json()
        
        if not data:
            raise HTTPException(status_code=400, detail="No data received")

        # 2. Format the dynamic fields into an HTML table
        form_rows = ""
        for key, value in data.items():
            form_rows += f"""
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><b>{key}</b></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{value}</td>
                </tr>
            """

        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">New Contact Inquiry</h2>
            </div>
            <div style="padding: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                    {form_rows}
                </table>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">
                    This message was sent from the ARP Motors contact form.
                </p>
            </div>
        </div>
        """

        # 3. Create the message
        message = MessageSchema(
            subject="New Website Inquiry - ARP Motors",
            recipients=["arperves@gmail.com"], # Your receiving email
            body=html,
            subtype="html"
        )

        # 4. Send the mail
        fm = FastMail(contact_conf)
        await fm.send_message(message)
        
        return {"status": "success", "message": "Inquiry sent successfully"}

    except Exception as e:
        print(f"MAIL ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")