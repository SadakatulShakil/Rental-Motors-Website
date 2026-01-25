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
    href="https://wa.me/447593799975" // Redirects to WhatsApp (uses International Format without the +)
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all gap-2"
  >
    {/* WhatsApp SVG Icon */}
    <svg 
      viewBox="0 0 24 24" 
      className="h-5 w-5 fill-current text-green-400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
    07593 799975
  </a>
          </div>
        </div>
      </div>
      
      {showForm && <BookingForm motorcycleOptions={motorcycleOptions} onClose={() => setShowForm(false)} />}
    </section>
  );
}