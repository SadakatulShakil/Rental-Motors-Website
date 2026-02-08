"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Props {
  limit?: number
  showViewMore?: boolean
  isFullPage?: boolean // 🔹 New prop to force Grid view on mobile
}

export default function GallerySection({ limit, showViewMore = false, isFullPage = false }: Props) {
  const [images, setImages] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const imagesToShow = limit ? images.slice(0, limit) : images

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imgRes, metaRes] = await Promise.all([
          fetch(`${apiUrl}/admin/gallery/`),
          fetch(`${apiUrl}/admin/meta/gallery`)
        ])
        if (imgRes.ok) setImages(await imgRes.json())
        if (metaRes.ok) setMeta(await metaRes.json())
      } catch (err) {
        console.error("Gallery fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [apiUrl])

  // --- Mobile Auto-Scroll Logic (Only for Slider mode) ---
  useEffect(() => {
    if (loading || imagesToShow.length === 0 || window.innerWidth >= 768 || isFullPage) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % imagesToShow.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [loading, imagesToShow.length, isFullPage])

  // Smooth scroll for Slider mode
  useEffect(() => {
    if (scrollRef.current && !isFullPage && window.innerWidth < 768) {
      const container = scrollRef.current;
      const scrollAmount = container.offsetWidth * activeIndex;
      container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  }, [activeIndex, isFullPage])

  if (loading) return <div className="py-20 text-center font-black italic text-slate-400 uppercase tracking-widest">Developing Film...</div>

  return (
    <section id="gallery" className="py-8 px-4 bg-white text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20 px-4">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
          {meta?.page_title || "The Collection"}
        </h2>
        <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
        <h3 className="text-base md:text-xl text-slate-500 italic max-w-2xl mx-auto leading-relaxed">
          {meta?.page_subtitle || "Explore our premium fleet in action."}
        </h3>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Container Logic: 
            - If isFullPage: Grid-cols-2 on mobile
            - If Home: Flex Slider on mobile
        */}
        <div 
          ref={scrollRef}
          className={`
            ${isFullPage 
              ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3" 
              : "flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar gap-4 px-4 pb-8"
            }
          `}
        >
          {imagesToShow.map((img, index) => (
            <div 
              key={img.id || index} 
              className={`
                ${isFullPage ? "min-w-0 h-[200px] md:h-[400px]" : "min-w-[85vw] md:min-w-0 snap-center h-[400px] md:h-[500px]"}
                group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-100 transition-all duration-500 shadow-sm
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 z-10" />
              
              <img
                src={img.image}
                alt={img.description || "Gallery Image"}
                className="w-full h-full object-cover transition-transform duration-700 md:scale-105 md:group-hover:scale-110"
                loading="lazy"
              />

              {/* Text Overlay - Smaller for the 2-column grid */}
              <div className={`absolute inset-0 z-20 flex flex-col justify-end p-4 md:p-8 transition-all duration-500
                ${isFullPage ? "opacity-100" : "translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 opacity-100 md:opacity-0 md:group-hover:opacity-100"}
              `}>
                <p className={`text-white font-bold italic uppercase tracking-tight leading-tight
                  ${isFullPage ? "text-xs md:text-xl" : "text-xl"}
                `}>
                  {img.description || "Action"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots - Hidden if isFullPage */}
        {!isFullPage && (
          <div className="flex md:hidden justify-center gap-2 mt-4">
            {imagesToShow.map((_, idx) => (
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
        <div className="mt-12 md:mt-16 text-center px-6">
          <Link
            href="/gallery"
            className="inline-flex w-full md:w-auto items-center justify-center gap-3 bg-slate-950 text-white px-12 py-4 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
          >
            Explore Full Archive
          </Link>
        </div>
      )}
    </section>
  )
}