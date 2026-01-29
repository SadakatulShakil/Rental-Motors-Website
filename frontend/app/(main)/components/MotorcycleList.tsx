"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import BookingForm from "./BookingForm"
import { FaUserFriends, FaGasPump } from "react-icons/fa"
import BikePriceCalculator from "./BikePriceCalculator"

export default function MotorcycleList({ limit, showViewMore = false }: any) {
  const [bikes, setBikes] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [selectedBike, setSelectedBike] = useState("")
  const [activeCalc, setActiveCalc] = useState<string | null>(null) // Track which bike's calc is open

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  }, [])

  if (loading) return <div className="py-20 text-center font-black italic text-slate-400 uppercase tracking-widest">Warming Engines...</div>

  const bikesToShow = limit ? bikes.slice(0, limit) : bikes

  return (
    <section className="py-8 px-4 bg-white text-slate-900">
      <div className="text-center max-w-7xl mx-auto mb-16 px-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">{meta?.page_title}</h2>
        <h3 className="text-xl text-gray-700 italic">{meta?.page_subtitle}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {bikesToShow.map((bike) => (
          <div key={bike.slug} className="group flex flex-col bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
            {/* Image Section */}
            <Link href={`/bikes/${bike.slug}`} className="relative h-72 w-full overflow-hidden block">
    <Image 
      // Fallback to a placeholder if bike.image is missing
      src={bike.image || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"} 
      alt={bike.name} 
      fill 
      // Remove unoptimized to allow Next.js to cache and optimize
      // unoptimized 
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover group-hover:scale-110 transition-transform duration-700"
      priority={false}
    />
    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-black uppercase italic shadow-xl z-10">
        {bike.type || "Sports"}
    </div>
</Link>
            {/* Content Section */}
            <div className="p-10 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">{bike.name}</h3>
                <div className="flex gap-4 text-[10px] font-bold uppercase text-slate-400">
                  <span className="flex items-center gap-1"><FaUserFriends className="text-blue-500" /> {bike.max_passengers || 2}</span>
                  <span className="flex items-center gap-1"><FaGasPump className="text-blue-500" /> {bike.cc}</span>
                </div>
              </div>

              {/* Calculator Integration */}
              <div className="mb-8">
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
                    + Calculate Price for your trip
                  </button>
                )}
              </div>

              <div className="mt-auto flex justify-between items-center pt-6 border-t border-slate-200">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Daily Rate</p>
                  <p className="text-3xl font-black italic text-slate-950 leading-none">{bike.price}</p>
                </div>
                <button
                  onClick={() => { setSelectedBike(bike.name); setShowBooking(true); }}
                  className="bg-blue-600 hover:bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-xl shadow-blue-900/20"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showViewMore && (
        <div className="text-center mt-10">
          <Link
            href="/bikes"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
          >
            View More Bikes
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