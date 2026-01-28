"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

interface Props {
  limit?: number
  showViewMore?: boolean
}

export default function GallerySection({ limit, showViewMore = false }: Props) {
  const [images, setImages] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
      }
    }
    fetchData()
  }, [])

  const imagesToShow = limit ? images.slice(0, limit) : images

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-12 px-4">
        {/* Title from Universal Meta */}
        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase">
          {meta?.page_title || "Captured Moments"}
        </h2>
        <div className="w-16 h-1 bg-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg text-slate-600 max-w-2xl mx-auto">
          {meta?.page_subtitle || "Explore our premium fleet in action."}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {imagesToShow.map((img) => (
          <div key={img.id} className="group relative h-72 overflow-hidden rounded-2xl shadow-md bg-slate-100">
            <img
              src={img.image}
              alt={img.description || "Gallery Image"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {img.description && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-sm font-medium">{img.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showViewMore && (
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
          >
            View Full Gallery
          </Link>
        </div>
      )}
    </section>
  )
}