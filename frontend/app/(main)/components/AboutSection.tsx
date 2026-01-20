"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function AboutSection() {
  const [data, setData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    hero_image: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch("http://localhost:8000/admin/about"); // Ensure your backend allows public GET on this route
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to load about data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) return <div className="py-16 text-center text-black">Loading...</div>;
  if (!data) return null;

  return (
    <section id="about" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Row 1: Title + Subtitle */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-black mb-2">{data.title}</h2>
          <h3 className="text-xl text-gray-700">{data.subtitle}</h3>
        </div>

        {/* Row 2: Details + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-gray-700 space-y-4 whitespace-pre-line">
            {/* whitespace-pre-line preserves paragraphs/breaks from textarea */}
            {data.description}
          </div>
          
          <div className="relative w-full h-80 md:h-96">
            <Image
              src={data.hero_image || "/hero-bg.jpg"} // Fallback to local image if empty
              alt={data.title}
              fill
              unoptimized={true}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}