"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import BookingForm from "./BookingForm"

export default function HeroSection() {
  const [slides, setSlides] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [motorcycleOptions, setMotorcycleOptions] = useState<string[]>([])
  
  useEffect(() => {
    // 1. Fetch Slider Data
    fetch("http://localhost:8000/admin/hero/slides")
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(err => console.error("Hero Slider Fetch Error:", err))

    // 2. 🔹 Fetch Real Bike Names for the Booking Form
    fetch("http://localhost:8000/admin/bikes")
      .then(res => res.json())
      .then(data => {
        // Assuming your API returns an array of objects like [{ name: "KTM...", ... }]
        const names = data.map((bike: any) => bike.name)
        setMotorcycleOptions(names)
      })
      .catch(err => console.error("Bikes Fetch Error:", err))
  }, [])

  // Auto-Scroll Logic
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [slides])

  if (slides.length === 0) return <div className="h-[90vh] bg-slate-900 animate-pulse" />

  return (
    <section className="relative w-full h-[90vh] overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <Image 
            src={slide.image_url} 
            fill 
            alt={slide.title} 
            className="object-cover" 
            priority={index === 0}
            unoptimized // Bypasses the 'private IP' error
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-5xl md:text-7xl font-black uppercase mb-4 tracking-tight drop-shadow-2xl">
              {slide.title}
            </h1>
            <p className="text-white text-xl md:text-2xl mb-12 font-light italic max-w-2xl">
              {slide.subtitle}
            </p>
            
            {/* 🔹 YOUR BUTTONS ARE HERE */}
            <div className="flex gap-6">
              {/* VIEW BIKES CIRCLE */}
              <Link 
                href="/bikes" 
                className="bg-red-600 text-white w-32 h-32 rounded-full text-sm font-bold hover:bg-red-700 transition-all hover:scale-110 flex items-center justify-center text-center shadow-xl leading-tight border-2 border-white/20 uppercase"
              >
                VIEW<br/>BIKES
              </Link>

              {/* BOOK NOW CIRCLE */}
              <button
                onClick={() => setShowForm(true)}
                className="bg-yellow-500 text-black w-32 h-32 rounded-full text-sm font-bold hover:bg-yellow-600 transition-all hover:scale-110 flex items-center justify-center text-center shadow-xl leading-tight border-2 border-black/10 uppercase"
              >
                BOOK<br/>NOW
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* 🔹 SLIDE INDICATORS (The little dots at the bottom) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`h-2 transition-all rounded-full ${
                i === current ? "w-10 bg-blue-600" : "w-2 bg-white/50"
            }`} 
          />
        ))}
      </div>

      {showForm && (
        <BookingForm 
          motorcycleOptions={motorcycleOptions} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </section>
  )
}