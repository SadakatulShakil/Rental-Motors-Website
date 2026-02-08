"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import * as FaIcons from "react-icons/fa"

export default function DynamicIncludedSection({ limit, showViewMore = false }: any) {
  const [features, setFeatures] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const featuresToShow = limit ? features.slice(0, limit) : features;
  const hasMoreFeatures = features.length > (limit || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fRes, pRes, mRes] = await Promise.all([
          fetch(`${apiUrl}/admin/include/features`),
          fetch(`${apiUrl}/admin/include/policies`),
          fetch(`${apiUrl}/admin/meta/include`)
        ])
        if (fRes.ok) setFeatures(await fRes.json())
        if (pRes.ok) setPolicies(await pRes.json())
        if (mRes.ok) setMeta(await mRes.json())
      } finally { setLoading(false) }
    }
    fetchData()
  }, [apiUrl])

  // --- Mobile-Only Auto-Scroll Logic ---
  useEffect(() => {
    if (loading || policies.length === 0 || window.innerWidth >= 1024) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % policies.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [loading, policies.length])

  useEffect(() => {
    if (scrollRef.current && window.innerWidth < 1024) {
      const container = scrollRef.current;
      const scrollAmount = container.offsetWidth * activeIndex;
      container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  }, [activeIndex])

  if (loading) return <div className="py-20 text-center font-black italic text-slate-400 uppercase tracking-widest">Ignition On...</div>

  return (
    <section className="py-8 md:py-8 bg-white overflow-hidden">
      {/* 1. Header */}
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
          {meta?.page_title || "Rental Essentials"}
        </h2>
        <h3 className="text-base md:text-xl text-gray-600 italic max-w-2xl mx-auto leading-relaxed">
          {meta?.page_subtitle}
        </h3>
      </div>

      {/* 2. Features Grid: 2 cols on Mobile, 4 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto px-4 mb-12">
        {featuresToShow.map((f: any, index: number) => {
          const IconComponent = (FaIcons as any)[f.icon_name] || FaIcons.FaMotorcycle
          return (
            <div 
        key={f.id} 
        className={`bg-white p-6 rounded-lg shadow text-center flex flex-col items-center 
          ${index === 3 ? "flex md:hidden" : "flex"} 
        `}>
              <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-200">
                <IconComponent size={24} />
              </div>
              <h3 className="font-black text-sm md:text-base text-slate-900 uppercase italic leading-tight mb-2">
                {f.title}
              </h3>
              <p className="text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed">
                {f.subtitle}
              </p>
            </div>
          )
        })}
      </div>

      {/* View More Button */}
      {showViewMore && hasMoreFeatures && (
         <div className="text-center mb-20 px-4">
           <Link 
             href="/include" 
             className="inline-flex w-full md:w-auto items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-slate-900 text-slate-900 font-black uppercase italic text-xs rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
           >
             View All Benefits <FaIcons.FaArrowRight />
           </Link>
         </div>
      )}

      {/* 3. Policies Section: Slider on Mobile, Premium Grid on Desktop */}
      <div className="bg-slate-950 py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Mobile Slider Container (Hidden on Desktop) */}
          <div 
            ref={scrollRef} 
            className="flex lg:grid lg:grid-cols-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar gap-6"
          >
            {policies.map((p: any) => (
              <div key={p.id} className="min-w-full lg:min-w-0 snap-center px-2 lg:px-0">
                <div className="h-full bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-sm hover:border-blue-500/50 transition-colors group">
                  <h3 className="text-2xl font-black text-white uppercase italic mb-6 text-center lg:text-left tracking-tighter">
                    {p.title}
                  </h3>
                  <ul className="space-y-4">
                    {p.points?.split(',').map((point: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <span className="mt-2 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                        <span className="text-sm font-medium leading-snug">{point.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Dot Indicators: Only visible on Mobile/Tablet */}
          <div className="flex lg:hidden justify-center gap-3 mt-10">
            {policies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-500 rounded-full ${
                  activeIndex === idx ? "w-10 h-2 bg-blue-500" : "w-2 h-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}