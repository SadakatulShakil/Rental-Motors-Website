"use client"
import { useState, useEffect } from "react"

export default function AdminContactPage() {
  const [fields, setFields] = useState<any[]>([])
  const [info, setInfo] = useState({ 
    address: "", phone: "", email: "", latitude: 0, longitude: 0 
  })
  
  // 🔹 SECTION 1: UNIVERSAL META (Matches Gallery & Included Pages)
  const [metaData, setMetaData] = useState({
    header_title: "", header_description: "", header_image: "",
    page_title: "", page_subtitle: ""
  })

  const [uploading, setUploading] = useState(false)
  const [newField, setNewField] = useState({ label: "", field_type: "text" })

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [iRes, mRes, fRes] = await Promise.all([
      fetch("http://localhost:8000/admin/contact/info"),
      fetch("http://localhost:8000/admin/meta/contact"),
      fetch("http://localhost:8000/admin/contact/fields")
    ])
    if (iRes.ok) setInfo(await iRes.json())
    if (mRes.ok) setMetaData(await mRes.json())
    if (fRes.ok) setFields(await fRes.json())
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true)
    const data = new FormData(); data.append("image", file)
    const res = await fetch("http://localhost:8000/admin/about/upload-image", {
      method: "POST", headers: { Authorization: `Bearer ${token}` }, body: data,
    })
    const result = await res.json()
    setMetaData({ ...metaData, header_image: result.url })
    setUploading(false)
  }

  const handleSaveMeta = async () => {
    await fetch("http://localhost:8000/admin/meta/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(metaData),
    })
    alert("Contact Header Updated!")
  }

  const handleSaveInfo = async () => {
    await fetch("http://localhost:8000/admin/contact/info", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(info)
    })
    alert("Contact Details & Map Updated")
  }

  const handleAddField = async () => {
    if (!newField.label) return alert("Label is required")
    await fetch("http://localhost:8000/admin/contact/fields", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newField)
    })
    setNewField({ label: "", field_type: "text" })
    fetchData()
  }

  const handleDeleteField = async (id: number) => {
    if (!confirm("Delete this field?")) return
    await fetch(`http://localhost:8000/admin/contact/fields/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Contact Page</h1>

      {/* 🔹 SECTION 1: UNIVERSAL META (EXACT MATCH TO GALLERY PAGE) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-black">Header & Page Titles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Banner Title</label>
              <input placeholder="e.g., CONTACT US" value={metaData.header_title} onChange={e => setMetaData({...metaData, header_title: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Banner Description</label>
              <textarea placeholder="Header Description" value={metaData.header_description} onChange={e => setMetaData({...metaData, header_description: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Section Title</label>
                <input placeholder="Body Section Title" value={metaData.page_title} onChange={e => setMetaData({...metaData, page_title: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Section Subtitle</label>
                <input placeholder="Body Section Subtitle" value={metaData.page_subtitle} onChange={e => setMetaData({...metaData, page_subtitle: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <button onClick={handleSaveMeta} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/10">
              Save Header Settings
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 transition-hover hover:border-blue-400">
            {metaData.header_image ? (
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden shadow-inner">
                 <img src={metaData.header_image} className="w-full h-full object-cover" alt="Preview" />
              </div>
            ) : (
              <div className="h-40 flex items-center text-gray-400 italic">No banner image uploaded</div>
            )}
            <input type="file" onChange={handleImageUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full" />
          </div>
        </div>
      </div>

      {/* 🔹 SECTION 2: CONTACT DETAILS & LOCATION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-black">Contact Details & Map Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Physical Address</label>
              <input placeholder="123 Motor Street..." value={info.address} onChange={e => setInfo({...info, address: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone Number</label>
                  <input placeholder="+123..." value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                  <input placeholder="info@..." value={info.email} onChange={e => setInfo({...info, email: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <p className="text-xs font-bold uppercase text-slate-500 mb-2">Google Maps Coordinates</p>
            <div className="space-y-3">
  {/* Latitude Input */}
  <input 
    type="number" 
    step="any" 
    placeholder="Latitude" 
    // If value is NaN, show an empty string so the user can type
    value={isNaN(info.latitude) ? "" : info.latitude} 
    onChange={e => {
      const val = e.target.value;
      setInfo({
        ...info, 
        // If input is empty, set to NaN; otherwise parse to float
        latitude: val === "" ? NaN : parseFloat(val)
      })
    }} 
    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500" 
  />

  {/* Longitude Input */}
  <input 
    type="number" 
    step="any" 
    placeholder="Longitude" 
    value={isNaN(info.longitude) ? "" : info.longitude} 
    onChange={e => {
      const val = e.target.value;
      setInfo({
        ...info, 
        longitude: val === "" ? NaN : parseFloat(val)
      })
    }} 
    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500" 
  />
</div>
            <button onClick={handleSaveInfo} className="w-full bg-slate-800 hover:bg-black text-white py-2 rounded-lg font-bold transition-all">
              Update Info & Map
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 SECTION 3: FORM BUILDER */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-black">Manage Form Fields</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-4 rounded-xl mb-6">
          <div className="flex-1 w-full">
             <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Field Label</label>
             <input placeholder="e.g., Your Name" value={newField.label} onChange={e => setNewField({...newField, label: e.target.value})} className="w-full border p-2 rounded" />
          </div>
          <div className="w-full md:w-48">
             <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Type</label>
             <select value={newField.field_type} onChange={e => setNewField({...newField, field_type: e.target.value})} className="w-full border p-2 rounded">
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="textarea">Large Message</option>
             </select>
          </div>
          <button onClick={handleAddField} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-green-900/10">
            Add Field
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map(f => (
            <div key={f.id} className="p-4 border rounded-xl flex justify-between items-center bg-white shadow-sm border-gray-100 group">
              <div>
                <p className="font-bold text-slate-800">{f.label}</p>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">{f.field_type}</p>
              </div>
              <button onClick={() => handleDeleteField(f.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}