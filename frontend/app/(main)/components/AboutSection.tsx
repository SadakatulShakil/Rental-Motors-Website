"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function AboutSection() {
  const [meta, setMeta] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllAboutData = async () => {
      try {
        // 🔹 Fetch from both the Universal Meta and the Specific About Content
        const [metaRes, contentRes] = await Promise.all([
          fetch("http://localhost:8000/admin/meta/about"),
          fetch("http://localhost:8000/admin/about")
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
  }, []);

  if (loading) return <div className="py-16 text-center text-black">Loading...</div>;
  // If either fails to load, don't break the page
  if (!meta || !content) return null;

  return (
    <section id="about" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Row 1: Page Title + Page Subtitle (From Universal Meta) */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-black mb-2">
            {meta.page_title || "Our Vision"}
          </h2>
          <h3 className="text-lg text-gray-700 italic">
            {meta.page_subtitle}
          </h3>
        </div>

        {/* Row 2: Content Details + Hero Image (From About Content) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Main Description Text */}
          <div className="text-gray-700 text-lg leading-relaxed space-y-4 whitespace-pre-line order-2 md:order-1">
            {content.description}
          </div>
          
          {/* Main Hero Image */}
          <div className="relative w-full h-80 md:h-[500px] order-1 md:order-2">
            <Image
              src={content.hero_image || "/hero-bg.jpg"}
              alt={meta.page_title}
              fill
              unoptimized={true} // Set to true if using external URLs from FastAPI
              className="rounded-2xl shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}