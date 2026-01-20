"use client"

import { useEffect, useState } from "react"

interface Bike {
  slug: string;
  name: string;
  price: string;
  image: string;
  cc: string;
  fuel: string;
  topSpeed: string;
  description: string;
}

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    cc: "",
    fuel: "",
    topSpeed: "",
    description: "",
    image: ""
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    fetchBikes()
  }, [])

  const fetchBikes = async () => {
    try {
      const res = await fetch("http://localhost:8000/admin/bikes")
      const data = await res.json()
      setBikes(data)
    } catch (err) {
      console.error("Failed to fetch bikes")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const data = new FormData()
    data.append("image", file)

    const res = await fetch("http://localhost:8000/admin/about/upload-image", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    })
    const result = await res.json()
    setFormData({ ...formData, image: result.url })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Generate slug from name
    const slug = formData.name.toLowerCase().replace(/ /g, "-")
    
    const res = await fetch("http://localhost:8000/admin/bikes/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ ...formData, slug }),
    })

    if (res.ok) {
      alert("Bike added!")
      setIsAdding(false)
      fetchBikes()
    }
  }

  if (loading) return <div className="p-10 text-black">Loading...</div>

  return (
    <main className="p-8 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Manage Fleet</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {isAdding ? "Cancel" : "Add New Bike"}
        </button>
      </div>

      {/* ADD BIKE FORM */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Bike Name (e.g. KTM Duke 390)" onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input className="border p-2 rounded" placeholder="Price (e.g. ৳3,500)" onChange={e => setFormData({...formData, price: e.target.value})} required />
          <input className="border p-2 rounded" placeholder="Engine (e.g. 373cc)" onChange={e => setFormData({...formData, cc: e.target.value})} />
          <input className="border p-2 rounded" placeholder="Fuel (e.g. 13.5L)" onChange={e => setFormData({...formData, fuel: e.target.value})} />
          <input className="border p-2 rounded" placeholder="Top Speed" onChange={e => setFormData({...formData, topSpeed: e.target.value})} />
          <input type="file" className="border p-2 rounded" onChange={handleImageUpload} />
          <textarea className="border p-2 rounded col-span-2" placeholder="Description" rows={3} onChange={e => setFormData({...formData, description: e.target.value})} />
          <button type="submit" className="bg-green-600 text-white py-3 rounded-lg col-span-2">Save Bike</button>
        </form>
      )}

      {/* BIKES TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Specs</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike.slug} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <img src={bike.image} alt="" className="w-20 h-12 object-cover rounded" />
                </td>
                <td className="p-4 font-bold">{bike.name}</td>
                <td className="p-4 text-blue-600 font-semibold">{bike.price}</td>
                <td className="p-4 text-sm text-gray-500">{bike.cc} | {bike.fuel}</td>
                <td className="p-4">
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}