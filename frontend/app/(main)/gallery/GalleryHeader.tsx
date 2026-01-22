"use client"
import Image from "next/image";
import { useState, useEffect } from "react"
import BookingForm from "../components/BookingForm";

export default function GalleryHeader() {
  const [showForm, setShowForm] = useState(false)
  const [meta, setMeta] = useState<any>(null)
  const [motorcycleOptions, setMotorcycleOptions] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metaRes, bikesRes] = await Promise.all([
          fetch("http://localhost:8000/admin/meta/gallery"),
          fetch("http://localhost:8000/admin/bikes")
        ]);
        if (metaRes.ok) setMeta(await metaRes.json());
        if (bikesRes.ok) {
          const bikes = await bikesRes.json();
          setMotorcycleOptions(bikes.map((b: any) => b.name));
        }
      } catch (err) { console.error("Gallery Header Fetch Error:", err); }
    };
    fetchData();
  }, []);

  if (!meta) return <div className="h-[80vh] bg-slate-900 animate-pulse" />;

  const headerImg = meta.header_image && meta.header_image.startsWith('http') 
    ? meta.header_image 
    : "/bike-gallery.png"; // Your fallback

  return (
    <section className="relative w-full h-[75vh] md:h-[80vh] mt-[72px] overflow-hidden bg-slate-900">
      {/* Background Image */}
      <Image
        src={headerImg}
        alt="Gallery Header"
        fill
        priority
        unoptimized={true}
        className="object-cover object-center transition-transform duration-1000 hover:scale-105"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
        <div className="max-w-2xl space-y-6">
          {/* Accent Label */}
          <div className="space-y-2">
            <span className="text-blue-500 font-bold tracking-widest uppercase text-xs md:text-sm">
              Our Community
            </span>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight uppercase">
              {meta.header_title || "CAPTURED MOMENTS"}
            </h1>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
          </div>

          <p className="text-slate-200 text-base md:text-lg max-w-lg leading-relaxed font-light">
            {meta.header_description || "With us, you get to choose the best scooter for rental, ensuring comfort, style, and reliability."}
          </p>
          
          {/* Action Button matching About/Include/Hero */}
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