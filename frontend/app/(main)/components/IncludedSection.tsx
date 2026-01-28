"use client"
import { useState, useEffect } from "react"
import * as FaIcons from "react-icons/fa"

export default function DynamicIncludedSection() {
  const [features, setFeatures] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<any>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // 🔹 Fetch data from PostgreSQL via FastAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fRes, pRes, mRes] = await Promise.all([
          fetch(`${apiUrl}/admin/include/features`),
          fetch(`${apiUrl}/admin/include/policies`),
          fetch(`${apiUrl}/admin/meta/include`) // 🔹 Fetch Meta
        ])
        if (fRes.ok) setFeatures(await fRes.json())
        if (pRes.ok) setPolicies(await pRes.json())
        if (mRes.ok) setMeta(await mRes.json())
      } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  if (loading) return <div className="py-16 text-center">Loading...</div>

  // Handle case where DB is empty
  if (features.length === 0 && policies.length === 0) {
    return <div className="py-16 text-center text-gray-500">No content found. Please add features in the Admin Panel.</div>
  }

  return (
    <section className="py-16 bg-gray-100">
      {/* Features Grid */}
      <div className="max-w-6xl mx-auto text-center mb-12 px-4">
        {/* 🔹 Dynamic Body Titles */}
        <h2 className="text-4xl font-bold text-black mb-2 uppercase">
          {meta?.page_title || "What Sets Us Apart"}
        </h2>
        <h3 className="text-lg text-gray-700 italic">
          {meta?.page_subtitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mb-16">

        {features.map((f: any) => {
          const IconComponent = (FaIcons as any)[f.icon_name] || FaIcons.FaMotorcycle
          return (
            <div key={f.id} className="bg-white p-6 rounded-lg shadow text-center flex flex-col items-center">
              <IconComponent className="text-red-600 w-10 h-10 mb-4" />
              <h3 className="font-bold text-xl text-black">{f.title}</h3>
              <p className="text-gray-700">{f.subtitle}</p>
            </div>
          )
        })}
      </div>

      {/* Policy Cards (Matching your uploaded image) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {policies.map((p: any) => (
          <div 
            key={p.id} 
            className={`${p.color_type === 'orange' ? 'bg-[#E68A45]' : 'bg-[#1A222C]'} p-10 rounded-[30px] text-white shadow-xl transition-transform hover:scale-105`}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">{p.title}</h3>
            <ul className="space-y-4">
              {p.points?.split(',').map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 bg-white rounded-full shrink-0" />
                  <p className="text-sm md:text-base leading-relaxed">{point.trim()}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}