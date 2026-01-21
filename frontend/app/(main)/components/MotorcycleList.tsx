"use client"
import Image from "next/image"
import { useState, useEffect } from "react" // 🔹 Added useEffect
import Link from "next/link"
import BookingForm from "./BookingForm"
import { FaUserFriends, FaGasPump } from "react-icons/fa"

interface Bike {
  id?: number;
  slug: string;
  name: string;
  price: string;
  image: string;
  cc: string;
  fuel: string;
  people?: string; // Optional if not in all records
}

interface Props {
  limit?: number
  showViewMore?: boolean
}

export default function MotorcycleList({ limit, showViewMore = false }: Props) {
  const [bikes, setBikes] = useState<Bike[]>([]) // 🔹 Dynamic bikes state
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [selectedBike, setSelectedBike] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      const [bRes, mRes] = await Promise.all([
        fetch("http://localhost:8000/admin/bikes"),
        fetch("http://localhost:8000/admin/meta/bikes") // 🔹 Use 'bikes' key here too
      ])
      if (bRes.ok) setBikes(await bRes.json())
      if (mRes.ok) setMeta(await mRes.json())
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="py-20 text-center">Loading...</div>

  const bikesToShow = limit ? bikes.slice(0, limit) : bikes

  return (
    <section id="motorcyclelist" className="py-16 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto text-center mb-12">
        {/* 🔹 Dynamic Titles from Meta Table */}
        <h2 className="text-4xl font-bold text-black mb-2">
          {meta?.page_title || "Choose The Best Vehicle"}
        </h2>
        <h3 className="text-lg text-gray-700">
          {meta?.page_subtitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {bikesToShow.map((bike) => (
          <div key={bike.slug} className="bg-white rounded-lg shadow p-4">
            <Link href={`/bikes/${bike.slug}`} className="block">
              <div className="relative w-full h-48 mb-3">
                <Image
                  src={bike.image}
                  alt={bike.name}
                  fill
                  unoptimized={true} // 🔹 Critical for localhost images
                  className="object-cover rounded"
                />
              </div>
          
              <h3 className="text-xl font-semibold text-black">
                {bike.name}
              </h3>
          
              <div className="flex gap-4 text-sm text-gray-700 my-2">
                <span className="flex items-center gap-1">
                  <FaUserFriends /> {bike.people || "1-2"}
                </span>
                <span>{bike.cc}</span>
                <span className="flex items-center gap-1">
                  <FaGasPump /> {bike.fuel}
                </span>
              </div>
            </Link>
          
            <div className="flex justify-between items-center mt-4">
              <p className="text-red-600 font-bold">
                {bike.price}
              </p>
          
              <button
                className="bg-yellow-500 px-4 py-2 rounded text-black font-semibold hover:bg-yellow-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedBike(bike.name)
                  setShowBooking(true)
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {showViewMore && (
        <div className="text-center mt-10">
          <Link
            href="/bikes"
            className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
          >
            View More Bikes
          </Link>
        </div>
      )}

      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <BookingForm
            motorcycleOptions={bikes.map(b => b.name)}
            onClose={() => setShowBooking(false)}
            // You might want to pass initialSelection={selectedBike} if your form supports it
          />
        </div>
      )}
    </section>
  )
}