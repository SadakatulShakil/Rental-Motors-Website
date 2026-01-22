"use client"
import { useEffect, useState } from "react"

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 🔹 Universal Meta State for Bikes Page
  const [metaData, setMetaData] = useState({
    header_title: "",
    header_description: "",
    header_image: "",
    page_title: "",
    page_subtitle: ""
  })

  // 🔹 Individual Bike Form State
  const [formData, setFormData] = useState({
    name: "", price: "", cc: "", fuel: "", topSpeed: "", description: "", image: ""
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    const fetchData = async () => {
      const [metaRes, bikesRes] = await Promise.all([
        fetch("http://localhost:8000/admin/meta/bikes"),
        fetch("http://localhost:8000/admin/bikes")
      ])
      if (metaRes.ok) setMetaData(await metaRes.json())
      if (bikesRes.ok) setBikes(await bikesRes.json())
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleImageUpload = async (file: File, isHeader: boolean) => {
    setUploading(true)
    const data = new FormData()
    data.append("image", file)
    const res = await fetch("http://localhost:8000/admin/about/upload-image", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    })
    const result = await res.json()
    if (isHeader) setMetaData({ ...metaData, header_image: result.url })
    else setFormData({ ...formData, image: result.url })
    setUploading(false)
  }

  const handleSaveMeta = async () => {
    await fetch("http://localhost:8000/admin/meta/bikes", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(metaData),
    })
    alert("Bikes Page Header Updated!")
  }

  const handleAddBike = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = formData.name.toLowerCase().replace(/ /g, "-")
    const res = await fetch("http://localhost:8000/admin/bikes/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...formData, slug }),
    })
    if (res.ok) { fetch("http://localhost:8000/admin/bikes").then(r => r.json()).then(setBikes); setIsAdding(false); }
  }

  if (loading) return <div className="p-10 text-black font-bold">Loading...</div>

  return (
    <main className="p-8 bg-gray-50 min-h-screen text-black space-y-8">
      
      {/* 🔹 SECTION 1: UNIVERSAL HEADER CONFIG */}
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
        <h2 className="text-xl font-bold mb-4">1. Bikes Page Header & Titles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <input placeholder="Header Title" value={metaData.header_title} onChange={e => setMetaData({...metaData, header_title: e.target.value})} className="w-full border p-2 rounded" />
            <textarea placeholder="Header Description" value={metaData.header_description} onChange={e => setMetaData({...metaData, header_description: e.target.value})} className="w-full border p-2 rounded" rows={2} />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Page Title" value={metaData.page_title} onChange={e => setMetaData({...metaData, page_title: e.target.value})} className="border p-2 rounded" />
              <input placeholder="Page Subtitle" value={metaData.page_subtitle} onChange={e => setMetaData({...metaData, page_subtitle: e.target.value})} className="border p-2 rounded" />
            </div>
            <button onClick={handleSaveMeta} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Save Header Info</button>
          </div>
          <div className="border-2 border-dashed rounded flex flex-col items-center justify-center p-4">
            {metaData.header_image && <img src={metaData.header_image} className="h-32 object-cover mb-2 rounded" />}
            <input type="file" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full"/>
          </div>
        </div>
      </div>

      {/* 🔹 SECTION 2: BIKE FLEET MANAGEMENT */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">2. Manage Fleet</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-black text-white px-4 py-2 rounded-lg">{isAdding ? "Cancel" : "Add New Bike"}</button>
      </div>

      {/* ADD BIKE FORM */}
      {isAdding && (
        <form onSubmit={handleAddBike} className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Bike Name (e.g. KTM Duke 390)" onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input className="border p-2 rounded" placeholder="Price (e.g. ৳3,500)" onChange={e => setFormData({...formData, price: e.target.value})} required />
          <input className="border p-2 rounded" placeholder="Engine (e.g. 373cc)" onChange={e => setFormData({...formData, cc: e.target.value})} />
          <input className="border p-2 rounded" placeholder="Fuel (e.g. 13.5L)" onChange={e => setFormData({...formData, fuel: e.target.value})} />
          <input className="border p-2 rounded" placeholder="Top Speed" onChange={e => setFormData({...formData, topSpeed: e.target.value})} />
          <input type="file" className="border p-2 rounded" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], false)} />
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