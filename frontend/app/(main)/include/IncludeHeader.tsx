"use client"
import Image from "next/image";
import { useState, useEffect } from "react"
import BookingForm from "../components/BookingForm";

export default function IncludeHeader() {
  const [showForm, setShowForm] = useState(false)
  const [meta, setMeta] = useState<any>(null)
  
  useEffect(() => {
    fetch("http://localhost:8000/admin/meta/include")
      .then(res => res.json())
      .then(data => setMeta(data))
      .catch(err => console.error("Error fetching meta:", err))
  }, [])

  if (!meta) return <div className="h-[80vh] bg-slate-900 animate-pulse" />

  // Fallback Image Logic (Ensures image shows even if DB is empty)
  const headerImg = meta.header_image && meta.header_image.startsWith('http') 
    ? meta.header_image 
    : "/include.jpg"; 

  const motorcycleOptions = ["KTM Duke 390","Yamaha R15","Honda CB500F"]

  return (
    <section className="relative w-full h-[75vh] md:h-[80vh] mt-[65px] overflow-hidden bg-slate-900">
      {/* Background Image */}
      <Image
        src={headerImg}
        alt="What is Included"
        fill
        priority
        unoptimized={true} 
        className="object-cover object-center transition-transform duration-1000 hover:scale-105"
      />

      {/* Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
        <div className="max-w-2xl space-y-6">
            {/* Blue Tagline Accent */}
            <div className="space-y-2">
              <span className="text-blue-500 font-bold tracking-widest uppercase text-xs md:text-sm">
                Full Service Rental
              </span>
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight uppercase">
                {meta.header_title || "WHAT'S INCLUDED"}
              </h1>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
            </div>

            {/* Description Typography */}
            <p className="text-slate-200 text-base md:text-lg max-w-lg leading-relaxed font-light">
                {meta.header_description || "Everything you need for a safe and exhilarating ride through London's streets."}
            </p>
            
            {/* Styled Button (Matches AboutHeader) */}
            <div className="pt-4">
              <button
                onClick={() => setShowForm(true)}
                className="group flex items-center bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40 active:scale-95"
              >
                <span>Book Your Ride</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
        </div>
      </div>
      
      {showForm && <BookingForm motorcycleOptions={motorcycleOptions} onClose={() => setShowForm(false)} />}
    </section>
  );
}