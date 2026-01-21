"use client"
import Image from "next/image";
import { useEffect, useState } from "react"
import BookingForm from "../components/BookingForm";

export default function AboutHeader() {
  const [showForm, setShowForm] = useState(false)
  const [meta, setMeta] = useState<any>(null)
  
  useEffect(() => {
    fetch("http://localhost:8000/admin/meta/about")
      .then(res => res.json())
      .then(data => setMeta(data))
      .catch(err => console.error("Error fetching meta:", err))
  }, [])

  if (!meta) return <div className="h-[90vh] bg-gray-900 animate-pulse" />

  // Fallback Image Logic: Check if header_image exists and is a valid URL
  const headerImg = meta.header_image && meta.header_image.startsWith('http') 
    ? meta.header_image 
    : "/banner2.jpeg"; // Your local public folder fallback

  const motorcycleOptions = ["KTM Duke 390","Yamaha R15","Honda CB500F"]

return (
  <section className="relative w-full h-[50vh] md:h-[85vh] mt-[65px] overflow-hidden bg-slate-900">
    {/* Background Image */}
    <Image
      src={headerImg}
      alt="About Header"
      fill
      priority
      unoptimized={true} 
      className="object-cover object-center"
    />

    {/* Improved Overlay: Darker on the left for text readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
      <div className="max-w-2xl">
          {/* Tagline */}
          <p className="text-blue-400 font-bold tracking-widest uppercase text-xs md:text-sm mb-3">
            Since 2010
          </p>
          
          {/* Optimized Title Size */}
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight uppercase mb-6">
              {meta.header_title || "ABOUT US"}
          </h1>

          {/* Clean Description */}
          <p className="text-slate-300 text-base md:text-lg max-w-md leading-relaxed mb-10 font-medium">
              {meta.header_description || "Premium motorcycle rentals for the ultimate London experience."}
          </p>
          
          {/* Modern Button */}
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
    
    {showForm && <BookingForm motorcycleOptions={motorcycleOptions} onClose={() => setShowForm(false)} />}
  </section>
);
}