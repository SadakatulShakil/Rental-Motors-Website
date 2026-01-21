"use client"
import Image from "next/image";
import { useState, useEffect } from "react"
import BookingForm from "../components/BookingForm";

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false)
  const [meta, setMeta] = useState<any>(null)
  const [motorcycleOptions, setMotorcycleOptions] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metaRes, bikesRes] = await Promise.all([
          fetch("http://localhost:8000/admin/meta/bikes"),
          fetch("http://localhost:8000/admin/bikes")
        ]);
        if (metaRes.ok) setMeta(await metaRes.json());
        if (bikesRes.ok) {
          const bikes = await bikesRes.json();
          setMotorcycleOptions(bikes.map((b: any) => b.name));
        }
      } catch (err) { console.error("Hero Fetch Error:", err); }
    };
    fetchData();
  }, []);
  
  if (!meta) return <div className="h-[90vh] bg-slate-900 animate-pulse" />;

  // Dynamic Image Logic
  const headerImg = meta.header_image && meta.header_image.startsWith('http') 
    ? meta.header_image 
    : "/hero-bg.jpg";

  return (
    <section className="relative w-full h-[75vh] md:h-[80vh] mt-[65px] overflow-hidden bg-slate-900">
      {/* Background Image with Zoom Effect */}
      <Image
        src={headerImg}
        alt="Hero Banner"
        fill
        priority
        unoptimized={true}
        className="object-cover object-center transition-transform duration-1000 hover:scale-105"
      />
      
      {/* Refined Gradient Overlay for better text pop */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
        <div className="max-w-2xl space-y-6">
          {/* Blue Accent Tagline */}
          <div className="space-y-2">
            <span className="text-blue-500 font-bold tracking-widest uppercase text-xs md:text-sm">
              London's Premium Rentals
            </span>
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight uppercase">
              {meta.header_title || "Ride Your Dream"}
            </h1>
            <div className="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          </div>

          <p className="text-slate-200 text-base md:text-lg max-w-lg leading-relaxed font-light">
            {meta.header_description || "Experience the thrill of the open road with our elite motorcycle fleet."}
          </p>
          
          {/* Modern Action Button */}
          <div className="pt-4">
            <button 
              onClick={() => setShowForm(true)} 
              className="group flex items-center bg-blue-600 text-white px-12 py-5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 active:scale-95"
            >
              <span className="text-lg">Book Your Ride</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {showForm && <BookingForm motorcycleOptions={motorcycleOptions} onClose={() => setShowForm(false)} />}
    </section>
  );
}