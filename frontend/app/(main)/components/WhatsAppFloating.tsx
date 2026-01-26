"use client"
import React, { useEffect, useState } from 'react'

export default function WhatsAppFloating() {
  const [contactInfo, setContactInfo] = useState<any>(null)

  useEffect(() => {
    fetch("http://localhost:8000/admin/contact/info")
      .then(res => res.json())
      .then(data => setContactInfo(data))
      .catch(err => console.error("WhatsApp Fetch Error:", err))
  }, [])

  // Fallback to your hardcoded number if API isn't ready
  const rawNumber = contactInfo?.phone || "447593799975"
  const cleanNumber = rawNumber.replace(/\D/g, '')
  
  const message = "Hi! I'm interested in renting a bike. Can you help me?"
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="hidden sm:flex fixed bottom-6 right-6 z-[9999] flex-col items-end gap-3 group">
      <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-2xl pointer-events-none uppercase tracking-tighter italic">
        Need Help? Chat Now
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40"></span>
        <WhatsAppIcon />
      </a>
    </div>
  )
}

export function WhatsAppMobileBtn() {
  const [contactInfo, setContactInfo] = useState<any>(null)

  useEffect(() => {
    fetch("http://localhost:8000/admin/contact/info")
      .then(res => res.json())
      .then(data => setContactInfo(data))
      .catch(err => console.error("WhatsApp Fetch Error:", err))
  }, [])

  const rawNumber = contactInfo?.phone || "447593799975"
  const cleanNumber = rawNumber.replace(/\D/g, '')
  const message = "Hi! I'm interested in renting a bike. Can you help me?"
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 bg-[#25D366] px-3 py-1.5 rounded-full shadow-lg active:scale-95 transition-all"
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-60"></span>
        <WhatsAppIcon className="w-5 h-5 fill-white relative z-10" />
      </div>
      <span className="text-[10px] font-black uppercase italic text-white animate-pulse tracking-tight text-center leading-none">
        Emergency Contact
        <span className="block mt-0.5 text-[12px] tracking-normal not-italic">
          {rawNumber}
        </span>
      </span>
    </a>
  )
}

function WhatsAppIcon({ className = "w-10 h-10 fill-white relative z-10" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}