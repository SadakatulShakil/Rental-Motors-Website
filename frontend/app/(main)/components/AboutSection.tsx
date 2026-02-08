"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function AboutSection() {
  const [meta, setMeta] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchAllAboutData = async () => {
      try {
        const [metaRes, contentRes] = await Promise.all([
          fetch(`${apiUrl}/admin/meta/about`),
          fetch(`${apiUrl}/admin/about`)
        ]);

        if (metaRes.ok) setMeta(await metaRes.json());
        if (contentRes.ok) setContent(await contentRes.json());
      } catch (err) {
        console.error("Failed to load about data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAboutData();
  }, [apiUrl]);

  if (loading) return <div className="py-20 text-center font-black italic text-slate-400 uppercase tracking-widest">Warming Engines...</div>;
  if (!meta || !content) return null;

  // Configuration for truncation
  const TEXT_LIMIT = 150; // Character limit before "See More" appears
  const isLongText = content.description?.length > TEXT_LIMIT;
  
  // Logic to determine what text to show
  const displayedText = isExpanded || !isLongText 
    ? content.description 
    : `${content.description.substring(0, TEXT_LIMIT)}...`;

  return (
    <section id="about" className="py-8 md:py-8 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
            {meta.page_title || "Our Vision"}
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
          <h3 className="text-base md:text-xl text-gray-600 italic max-w-2xl mx-auto leading-relaxed">
            {meta.page_subtitle}
          </h3>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          
          {/* Image Container (Order 1 on Mobile) */}
          <div className="relative group order-1 lg:order-2">
            <div className="relative w-full h-[300px] md:h-[550px] overflow-hidden rounded-[2.5rem] shadow-2xl">
              <Image
                src={content.hero_image || "/hero-bg.jpg"}
                alt={meta.page_title}
                fill
                unoptimized={true} 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          
          {/* Text Content (Order 2 on Mobile) */}
          <div className="space-y-6 order-2 lg:order-1 px-2">
            <div className="relative">
              <div className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-line font-medium transition-all duration-500">
                {/* On desktop we show full text, on mobile we use the toggle */}
                <span className="md:hidden">{displayedText}</span>
                <span className="hidden md:inline">{content.description}</span>
              </div>

              {/* Toggle Button - Only visible on Mobile if text is long */}
              {isLongText && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 md:hidden text-blue-600 font-black uppercase italic text-xs tracking-wider flex items-center gap-1"
                >
                  {isExpanded ? "Show Less ↑" : "Read More ↓"}
                </button>
              )}
            </div>
            
            {/* Call to action features */}
           {/* Call to action features - Centered for Mobile, Left-aligned for Desktop */}
<div className="pt-6 border-t border-slate-100 flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12">
  
  {/* Feature 1 */}
  <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
    <span className="text-2xl md:text-3xl font-black text-blue-600 uppercase italic leading-none">
      100%
    </span>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
      Genuine Parts
    </span>
  </div>

  {/* Vertical Divider - Hidden on mobile if you want full centering, or kept for style */}
  <div className="hidden sm:block w-[1px] h-8 bg-slate-100 self-center"></div>

  {/* Feature 2 */}
  <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
    <span className="text-2xl md:text-3xl font-black text-blue-600 uppercase italic leading-none">
      24/7
    </span>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
      Road Support
    </span>
  </div>
  
</div>
          </div>

        </div>
      </div>
    </section>
  )
}