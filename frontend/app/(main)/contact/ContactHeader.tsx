"use client"
import Image from "next/image";
import { useState, useEffect } from "react"
import BookingForm from "../components/BookingForm";

export default function ContactHeader() {
  const [showForm, setShowForm] = useState(false)
  const [meta, setMeta] = useState<any>(null)
  const [motorcycleOptions, setMotorcycleOptions] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metaRes, bikesRes] = await Promise.all([
          fetch("http://localhost:8000/admin/meta/contact"),
          fetch("http://localhost:8000/admin/bikes")
        ]);
        if (metaRes.ok) setMeta(await metaRes.json());
        if (bikesRes.ok) {
          const bikes = await bikesRes.json();
          setMotorcycleOptions(bikes.map((b: any) => b.name));
        }
      } catch (err) { console.error("Contact Header Fetch Error:", err); }
    };
    fetchData();
  }, []);

  if (!meta) return <div className="h-[70vh] bg-slate-900 animate-pulse" />;

  const headerImg = meta.header_image && meta.header_image.startsWith('http') 
    ? meta.header_image 
    : "/contact.jpg";

  return (
    <section className="relative w-full h-[70vh] md:h-[75vh] mt-[72px] overflow-hidden bg-slate-900">
      {/* Background Image */}
      <Image
        src={headerImg}
        alt="Contact Header"
        fill
        priority
        unoptimized={true}
        className="object-cover object-center transition-transform duration-1000 hover:scale-105"
      />

      {/* Dark Overlay - Optimized for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
        <div className="max-w-2xl space-y-6">
          {/* Accent Label */}
          <div className="space-y-2">
            <span className="text-blue-500 font-bold tracking-widest uppercase text-xs md:text-sm">
              24/7 Support
            </span>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight uppercase">
              {meta.header_title || "Get In Touch"}
            </h1>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
          </div>

          <p className="text-slate-200 text-base md:text-lg max-w-lg leading-relaxed font-light">
            {meta.header_description || "For a faster response, please call us directly or fill out our dynamic contact form below."}
          </p>
          
          {/* Main Action Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => setShowForm(true)}
              className="group flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40 active:scale-95"
            >
              <span>Book Your Ride</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <a 
              href="tel:07593799975"
              className="flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all"
            >
              📞 07593 799975
            </a>
          </div>
        </div>
      </div>
      
      {showForm && <BookingForm motorcycleOptions={motorcycleOptions} onClose={() => setShowForm(false)} />}
    </section>
  );
}