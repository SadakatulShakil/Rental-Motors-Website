"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import BookingForm from "./BookingForm"
import BikePriceCalculator from "./BikePriceCalculator"

interface Props {
  limit?: number
  showViewMore?: boolean
  isFullPage?: boolean // 🔹 New prop for the dedicated Bikes page
}

export default function MotorcycleList({ limit, showViewMore = false, isFullPage = false }: Props) {
  const [bikes, setBikes] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeCalc, setActiveCalc] = useState<string | null>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  // Logic to handle limit
  const bikesToShow = limit ? bikes.slice(0, limit) : bikes

  useEffect(() => {
    const fetchData = async () => {
      const [bRes, mRes] = await Promise.all([
        fetch(`${apiUrl}/admin/bikes`),
        fetch(`${apiUrl}/admin/meta/bikes`)
      ])
      if (bRes.ok) setBikes(await bRes.json())
      if (mRes.ok) setMeta(await mRes.json())
      setLoading(false)
    }
    fetchData()
  }, [apiUrl])

  // --- Mobile Auto-Scroll Logic (Only if NOT full page) ---
  useEffect(() => {
    if (loading || bikesToShow.length === 0 || window.innerWidth >= 768 || isFullPage) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bikesToShow.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [loading, bikesToShow.length, isFullPage])

  // Smooth scroll effect for the mobile slider
  useEffect(() => {
    if (scrollRef.current && !isFullPage && window.innerWidth < 768) {
      const container = scrollRef.current;
      const scrollAmount = container.offsetWidth * activeIndex;
      container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  }, [activeIndex, isFullPage])

  if (loading) return <div className="py-20 text-center font-black italic text-slate-400 uppercase tracking-widest">Warming Engines...</div>

  return (
    <section className="py-8 md:py-8 px-4 bg-white overflow-hidden">
      <div className="text-center max-w-7xl mx-auto mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">{meta?.page_title}</h2>
        <h3 className="text-base md:text-xl text-gray-600 italic max-w-2xl mx-auto leading-relaxed">{meta?.page_subtitle}</h3>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Layout Logic:
           - Slider: flex overflow-x-auto (Home Page)
           - Grid: grid grid-cols-2 (Full Page)
        */}
        <div 
          ref={scrollRef}
          className={`
            ${isFullPage 
              ? "grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 px-2" 
              : "flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar gap-6 px-4 pb-10"
            }
          `}
        >
          {bikesToShow.map((bike) => (
            <div key={bike.slug} 
              className={`
                ${isFullPage ? "min-w-0" : "min-w-[85vw] md:min-w-0 snap-center"} 
                group flex flex-col bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm transition-all
              `}
            >
              <Link href={`/bikes/${bike.slug}`} className={`relative w-full block ${isFullPage ? 'h-40 md:h-72' : 'h-56 md:h-72'}`}>
                <Image src={bike.image || "/placeholder-bike.jpg"} alt={bike.name} fill className="object-cover" />
              </Link>
              
              <div className={`flex-1 flex flex-col ${isFullPage ? 'p-3 md:p-10' : 'p-6 md:p-10'}`}>
                <h3 className={`${isFullPage ? 'text-sm md:text-3xl' : 'text-2xl md:text-3xl'} font-black uppercase italic tracking-tighter mb-2 md:mb-4`}>
                  {bike.name}
                </h3>
                
                {/* Desktop Estimator - Hide on small grid items if full page */}
                <div className={`${isFullPage ? 'hidden lg:block' : 'hidden md:block'} mb-8`}>
                  {activeCalc === bike.slug ? (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <BikePriceCalculator bike={bike} variant="compact" />
                      <button onClick={() => setActiveCalc(null)} className="mt-2 text-[10px] font-black text-red-500 uppercase italic">Close Estimator</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setActiveCalc(bike.slug)}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all"
                    >
                      + Calculate Price
                    </button>
                  )}
                </div>

                <div className="mt-auto flex justify-between items-center pt-2 md:pt-4 border-t border-slate-200">
                  <p className={`${isFullPage ? 'text-sm md:text-2xl' : 'text-2xl'} font-black italic text-slate-950`}>
                    {bike.price}<span className="text-[8px] md:text-[10px] text-slate-400 not-italic uppercase ml-1">/day</span>
                  </p>
                  <button
                    onClick={() => { setShowBooking(true); }}
                    className={`${isFullPage ? 'px-3 py-2 text-[10px]' : 'px-6 py-3 text-xs'} bg-blue-600 text-white rounded-xl font-black uppercase italic shadow-lg active:scale-90 transition-all`}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators: Only visible in Slider Mode */}
        {!isFullPage && (
          <div className="flex md:hidden justify-center gap-2 mt-2 mb-8">
            {bikesToShow.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  activeIndex === idx ? "w-8 bg-blue-600" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {showViewMore && (
        <div className="text-center mt-4 px-4">
          <Link
            href="/bikes"
            className="inline-block w-full md:w-auto bg-slate-950 text-white px-12 py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all shadow-xl"
          >
            Explore Full Fleet
          </Link>
        </div>
      )}
      
      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <BookingForm motorcycleOptions={bikes.map(b => b.name)} onClose={() => setShowBooking(false)} />
        </div>
      )}
    </section>
  )
}