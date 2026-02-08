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
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${apiUrl}/admin/hero/slides`)
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(err => console.error("Hero Slider Fetch Error:", err))

    fetch(`${apiUrl}/admin/bikes`)
      .then(res => res.json())
      .then(data => {
        const names = data.map((bike: any) => bike.name)
        setMotorcycleOptions(names)
      })
      .catch(err => console.error("Bikes Fetch Error:", err))
  }, [])

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 3000)
    return () => clearInterval(timer)
  }, [slides])

  if (slides.length === 0) return <div className="h-[90vh] bg-slate-900 animate-pulse" />

  return (
    <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image 
            src={slide.image_url} 
            fill 
            alt={slide.title} 
            className="object-cover" 
            priority={index === 0}
            unoptimized 
          />
          
          <div className="absolute inset-0 bg-black/50" />

          {/* 🔹 Content Container: Reduced pt-10 for mobile (was pt-20) */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 pt-10 md:pt-0">
            
            {/* 🔹 Heading: Reduced to text-4xl on mobile (was 3xl) for more punch, and 7xl on desktop */}
            <h1 className="text-white text-4xl md:text-7xl font-black uppercase mb-3 tracking-tighter drop-shadow-2xl leading-[0.9] md:leading-tight">
              {slide.title}
            </h1>

            {/* 🔹 Subtitle: Balanced text size */}
            <p className="text-white text-base md:text-2xl mb-8 md:mb-12 font-light italic max-w-2xl opacity-90">
              {slide.subtitle}
            </p>
            
            {/* 🔹 Interactive Buttons Container: Smaller gap for mobile */}
            <div className="flex gap-6 md:gap-10 mt-4 md:mt-12 relative">
              
              {/* VIEW BIKES CIRCLE */}
              <Link 
                href="/bikes" 
                className="group relative flex items-center justify-center animate-race-left opacity-0"
                style={{ animationDelay: '800ms' }}
              >
                <div className="absolute inset-0 rounded-full bg-red-600/40 animate-impact-pulse" />
                {/* 🔹 Circle Size: w-24 on mobile, w-32 on desktop */}
                <div className="bg-red-600 text-white w-28 h-28 md:w-32 md:h-32 rounded-full text-[8px] md:text-[10px] font-black hover:scale-110 transition-all flex flex-col items-center justify-center text-center shadow-xl border-4 border-white/10 uppercase italic z-10">
                  <span>EXPLORE</span>
                  <span className="text-lg md:text-2xl leading-none">BIKES</span>
                </div>
              </Link>

              {/* BOOK NOW CIRCLE */}
              <button
                onClick={() => setShowForm(true)}
                className="group relative flex items-center justify-center animate-race-right opacity-0"
                style={{ animationDelay: '800ms' }}
              >
                <div className="absolute inset-0 rounded-full bg-yellow-500/40 animate-impact-pulse" />
                {/* 🔹 Circle Size: w-24 on mobile, w-32 on desktop */}
                <div className="bg-yellow-500 text-black w-28 h-28 md:w-32 md:h-32 rounded-full text-[8px] md:text-[10px] font-black hover:scale-110 transition-all flex flex-col items-center justify-center text-center shadow-xl border-4 border-black/5 uppercase italic z-10">
                  <span>BOOK</span>
                  <span className="text-lg md:text-2xl leading-none">NOW</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`h-1.5 md:h-2 transition-all rounded-full ${
                i === current ? "w-8 md:w-10 bg-blue-600" : "w-1.5 md:w-2 bg-white/50"
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