"use client"
import { useEffect, useState } from "react"

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editSlug, setEditSlug] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // 🔹 SECTION 1: Meta State (Global Page Appearance)
  const [metaData, setMetaData] = useState({
    header_title: "",
    header_description: "",
    header_image: "",
    page_title: "",
    page_subtitle: ""
  })

  // 🔹 SECTION 2: Individual Bike Form State
  const initialForm = {
    name: "", price: "", cc: "", fuel: "", topSpeed: "", description: "", image: "",
    year_mf: "", fuel_use: "", color: "", max_passengers: 2, transmission: "Manual", type: "Sports",
    rental_charges: [
      { duration: "1 Day", charge: "", max_km: "120 KM", extra_charge: "20" },
      { duration: "7 Days", charge: "", max_km: "500 KM", extra_charge: "15" },
      { duration: "2 Weeks", charge: "", max_km: "900 KM", extra_charge: "12" },
      { duration: "1 Month", charge: "", max_km: "1200 KM", extra_charge: "10" }
    ]
  }
  const [formData, setFormData] = useState(initialForm)

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

  const handleSaveBike = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editSlug ? "PUT" : "POST"
    const url = editSlug ? `http://localhost:8000/admin/bikes/${editSlug}` : "http://localhost:8000/admin/bikes/"
    const slug = formData.name.toLowerCase().replace(/ /g, "-")

    // 🔹 Auto-formatting with Taka sign before saving
    const formattedData = {
      ...formData,
      slug,
      price: formData.price.startsWith("£") ? formData.price : `£${formData.price}`,
      topSpeed: formData.topSpeed.endsWith("km/h") ? formData.topSpeed : `${formData.topSpeed} km/h`,
      cc: formData.cc.endsWith("cc") ? formData.cc : `${formData.cc} cc`,
      fuel: formData.fuel.endsWith("L") ? formData.fuel : `${formData.fuel} L`,
      rental_charges: formData.rental_charges.map(rc => ({
        ...rc,
        charge: rc.charge.startsWith("£") ? rc.charge : `£${rc.charge}`,
        extra_charge: rc.extra_charge.includes("/ KM") ? rc.extra_charge : `£${rc.extra_charge} / KM`
      }))
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(formattedData),
    })

    if (res.ok) {
      setEditSlug(null); setIsAdding(false); setFormData(initialForm)
      fetch("http://localhost:8000/admin/bikes").then(r => r.json()).then(setBikes)
    }
  }

  const handleDelete = async (slug: string) => {
    if (window.confirm("Are you sure you want to remove this bike from the fleet?")) {
      try {
        const res = await fetch(`http://localhost:8000/admin/bikes/${slug}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
  
        if (res.ok) {
          // Remove from UI state so it disappears instantly
          setBikes(bikes.filter(bike => bike.slug !== slug))
        } else {
          const error = await res.json()
          alert(error.detail || "Failed to delete bike")
        }
      } catch (err) {
        console.error("Delete error:", err)
        alert("Something went wrong while deleting.")
      }
    }
  }

  const handleTableChange = (index: number, field: string, value: string) => {
    const updatedCharges = [...formData.rental_charges]
    updatedCharges[index] = { ...updatedCharges[index], [field]: value }
    setFormData({ ...formData, rental_charges: updatedCharges })
  }

  if (loading) return <div className="p-10 text-black font-bold italic">LOADING...</div>

  return (
    <main className="p-8 bg-gray-50 min-h-screen text-black space-y-12">
      
      {/* 🔹 SECTION 1: GLOBAL HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
        <h2 className="text-xl font-bold mb-4 uppercase italic">1. Global Bikes Page Header</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input placeholder="Header Title" value={metaData.header_title} onChange={e => setMetaData({...metaData, header_title: e.target.value})} className="w-full border p-2 rounded" />
            <textarea placeholder="Header Description" value={metaData.header_description} onChange={e => setMetaData({...metaData, header_description: e.target.value})} className="w-full border p-2 rounded" rows={2} />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Page Title" value={metaData.page_title} onChange={e => setMetaData({...metaData, page_title: e.target.value})} className="border p-2 rounded" />
              <input placeholder="Page Subtitle" value={metaData.page_subtitle} onChange={e => setMetaData({...metaData, page_subtitle: e.target.value})} className="border p-2 rounded" />
            </div>
            <button onClick={handleSaveMeta} className="bg-blue-600 text-white px-6 py-2 rounded font-black uppercase text-sm">Update Banner</button>
          </div>
          <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 bg-gray-50">
            {metaData.header_image && <img src={metaData.header_image} className="h-32 object-cover mb-2 rounded shadow-sm" />}
            <input type="file" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)} className="text-xs w-full"/>
          </div>
        </div>
      </div>

      {/* 🔹 SECTION 2: FLEET MANAGEMENT */}
      <div className="flex justify-between items-center border-t pt-8">
        <h2 className="text-2xl font-bold uppercase italic">2. Manage Fleet</h2>
        <button onClick={() => { setIsAdding(!isAdding); setEditSlug(null); setFormData(initialForm); }} className="bg-black text-white px-6 py-2 rounded-lg font-bold">
          {isAdding ? "Close Panel" : "+ Add New Bike"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSaveBike} className="bg-white p-8 rounded-2xl shadow-xl border space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-400 uppercase">Bike Name</label>
               <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-400 uppercase">Daily Price (Numerical)</label>
               <div className="flex items-center"><span className="p-2 bg-gray-100 border border-r-0 rounded-l font-bold">£</span>
               <input className="w-full border p-2 rounded-r" placeholder="3500" value={formData.price.replace("£", "")} onChange={e => setFormData({...formData, price: e.target.value})} required /></div>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-400 uppercase">Year</label>
               <input className="w-full border p-2 rounded" placeholder="2023" value={formData.year_mf} onChange={e => setFormData({...formData, year_mf: e.target.value})} />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-400 uppercase">Engine CC</label>
               <input className="w-full border p-2 rounded" placeholder="150cc" value={formData.cc} onChange={e => setFormData({...formData, cc: e.target.value})} />
            </div>

            {/* NEW FIELDS ADDED HERE */}
            <input className="border p-2 rounded" placeholder="Color (e.g. Matte Black)" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
            <input className="border p-2 rounded" placeholder="Type (e.g. Scooter / Cruiser)" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
            <input className="border p-2 rounded" type="number" placeholder="Max Passengers" value={formData.max_passengers} onChange={e => setFormData({...formData, max_passengers: parseInt(e.target.value)})} />
            <input className="border p-2 rounded" placeholder="Fuel Tank" value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} />
            
            <input className="border p-2 rounded" placeholder="Top Speed" value={formData.topSpeed} onChange={e => setFormData({...formData, topSpeed: e.target.value})} />
            <input className="border p-2 rounded" placeholder="Fuel Type" value={formData.fuel_use} onChange={e => setFormData({...formData, fuel_use: e.target.value})} />
            <input className="border p-2 rounded" placeholder="Transmission" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} />
            <input type="file" className="text-xs self-center" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], false)} />
          </div>

          <textarea className="w-full border p-2 rounded" placeholder="Description" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

          {/* DYNAMIC RENTAL TABLE */}
          <div className="space-y-4">
  <h4 className="font-bold text-sm uppercase italic text-blue-600">Rental Charges (Enter digits only)</h4>
  <div className="grid grid-cols-4 gap-4 px-2 text-[10px] font-bold text-gray-400 uppercase">
    <span>Duration</span>
    <span>Rate</span>
    <span>Limit (KM)</span>
    <span>Extra (Per KM)</span>
  </div>

  {formData.rental_charges.map((row, idx) => (
    <div key={idx} className="grid grid-cols-4 gap-2 items-center">
      {/* Duration Label - Read Only for consistency */}
      <div className="bg-gray-100 p-2 rounded text-sm font-bold text-gray-600 border">
        {row.duration}
      </div>

      {/* Charge Amount */}
      <div className="flex">
        <span className="p-2 bg-blue-50 border border-r-0 rounded-l text-blue-600 font-bold">£</span>
        <input 
          value={row.charge.replace("£", "")} 
          placeholder="0.00" 
          onChange={e => handleTableChange(idx, "charge", e.target.value)} 
          className="w-full border p-2 rounded-r text-sm font-bold focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      {/* Max KM */}
      <input 
        value={row.max_km} 
        placeholder="e.g. 120 KM" 
        onChange={e => handleTableChange(idx, "max_km", e.target.value)} 
        className="border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500" 
      />

      {/* Extra Charge */}
      <div className="flex">
        <span className="p-2 bg-gray-50 border border-r-0 rounded-l text-gray-500 font-bold">£</span>
        <input 
          value={row.extra_charge.replace("£", "").replace(" / KM", "")} 
          placeholder="0.20" 
          onChange={e => handleTableChange(idx, "extra_charge", e.target.value)} 
          className="w-full border p-2 rounded-r text-sm italic focus:ring-2 focus:ring-blue-500" 
        />
      </div>
    </div>
  ))}
</div>

          <button type="submit" className="w-full bg-blue-700 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all">
            {editSlug ? "Update Bike" : "Confirm and Save"}
          </button>
        </form>
      )}

      {/* LIST TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b text-[10px] font-bold uppercase text-gray-400">
            <tr><th className="p-4">Vehicle</th><th className="p-4">Daily Rate</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike.slug} className="border-b hover:bg-blue-50/50 transition-colors">
                <td className="p-4 flex items-center gap-4">
                  <img src={bike.image} className="w-20 h-12 object-cover rounded shadow-sm" />
                  <div><p className="font-bold uppercase italic">{bike.name}</p><p className="text-[10px] text-gray-400">{bike.color} | {bike.type}</p></div>
                </td>
                <td className="p-4 text-blue-600 font-black italic">{bike.price}</td>
                <td className="p-4 space-x-4">
                  <button onClick={() => { setEditSlug(bike.slug); setFormData(bike); setIsAdding(true); }} className="text-blue-500 font-bold">Edit</button>
                  <button 
                  onClick={() => handleDelete(bike.slug)}
                  className="text-red-500 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}