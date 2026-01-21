"use client"
import { useState, useEffect } from "react"

export default function AdminIncludedPage() {
  const [features, setFeatures] = useState([])
  const [policies, setPolicies] = useState([])
  const [uploading, setUploading] = useState(false)
  
  // 🔹 Universal Meta State
  const [metaData, setMetaData] = useState({
    header_title: "", header_description: "", header_image: "",
    page_title: "", page_subtitle: ""
  })

  // States for new entries
  const [newFeat, setNewFeat] = useState({ icon_name: "FaMotorcycle", title: "", subtitle: "" })
  const [newPolicy, setNewPolicy] = useState({ title: "", points: "", color_type: "orange" })

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    fetchData()
  }, [])

const fetchData = async () => {
    const [fRes, pRes, mRes] = await Promise.all([
      fetch("http://localhost:8000/admin/include/features"),
      fetch("http://localhost:8000/admin/include/policies"),
      fetch("http://localhost:8000/admin/meta/include")
    ])
    if (fRes.ok) setFeatures(await fRes.json())
    if (pRes.ok) setPolicies(await pRes.json())
    if (mRes.ok) setMetaData(await mRes.json())
  }

  // --- Feature Actions ---
  const handleAddFeature = async () => {
    if (!newFeat.title) return alert("Title is required")
    await fetch("http://localhost:8000/admin/include/features", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newFeat)
    })
    fetchData()
  }

  const handleDeleteFeature = async (id: number) => {
    if (!confirm("Delete this feature?")) return
    await fetch(`http://localhost:8000/admin/include/features/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
  }

  // --- Policy Actions ---
  const handleAddPolicy = async () => {
    if (!newPolicy.title || !newPolicy.points) return alert("Fill all policy fields")
    await fetch("http://localhost:8000/admin/include/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newPolicy)
    })
    setNewPolicy({ title: "", points: "", color_type: "orange" }) // Reset
    fetchData()
  }

  const handleDeletePolicy = async (id: number) => {
    if (!confirm("Delete this policy card?")) return
    await fetch(`http://localhost:8000/admin/include/policies/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
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
    await fetch("http://localhost:8000/admin/meta/include", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(metaData),
    })
    alert("Include Page Header Updated!")
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit "What's Included" Page</h1>
      
      {/* 🔹 SECTION 1: UNIVERSAL META (CLEANED) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-black">Header & Page Titles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Banner Title</label>
              <input placeholder="e.g., WHAT'S INCLUDED" value={metaData.header_title} onChange={e => setMetaData({...metaData, header_title: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
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
              <div className="h-40 flex items-center text-gray-400 italic">No image uploaded</div>
            )}
            <input type="file" onChange={handleImageUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full" />
          </div>
        </div>
      </div>
        
        {/* SECTION 1: FEATURES */}
        <section>
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Add Feature Icon</h2>
            <div className="space-y-3">
              <input placeholder="Icon Name (e.g. FaShieldAlt)" className="w-full border p-2 rounded" 
                value={newFeat.icon_name} onChange={e => setNewFeat({...newFeat, icon_name: e.target.value})} />
              <input placeholder="Feature Title" className="w-full border p-2 rounded" 
                value={newFeat.title} onChange={e => setNewFeat({...newFeat, title: e.target.value})} />
              <textarea placeholder="Subtitle/Description" className="w-full border p-2 rounded" 
                value={newFeat.subtitle} onChange={e => setNewFeat({...newFeat, subtitle: e.target.value})} />
              <button onClick={handleAddFeature} className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700">
                Add Feature Card
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {features.map((f: any) => (
              <div key={f.id} className="p-4 bg-white border rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold text-red-600">{f.icon_name}</p>
                  <p className="font-semibold">{f.title}</p>
                </div>
                <button onClick={() => handleDeleteFeature(f.id)} className="bg-gray-100 p-2 rounded text-red-500 hover:bg-red-50">Delete</button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: POLICIES */}
        <section>
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Add Policy Card</h2>
            <div className="space-y-3">
              <input placeholder="Policy Title (e.g. Deposit Policy)" className="w-full border p-2 rounded" 
                value={newPolicy.title} onChange={e => setNewPolicy({...newPolicy, title: e.target.value})} />
              
              <textarea placeholder="Points (Separate with commas: Point 1, Point 2)" className="w-full border p-2 rounded h-24" 
                value={newPolicy.points} onChange={e => setNewPolicy({...newPolicy, points: e.target.value})} />
              
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="color" checked={newPolicy.color_type === 'orange'} 
                    onChange={() => setNewPolicy({...newPolicy, color_type: 'orange'})} /> Orange
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="color" checked={newPolicy.color_type === 'dark'} 
                    onChange={() => setNewPolicy({...newPolicy, color_type: 'dark'})} /> Dark (Blue/Black)
                </label>
              </div>

              <button onClick={handleAddPolicy} className="w-full bg-black text-white font-bold py-2 rounded hover:bg-gray-800">
                Add Policy Card
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {policies.map((p: any) => (
              <div key={p.id} className={`p-4 border rounded-lg flex justify-between items-center text-white ${p.color_type === 'orange' ? 'bg-[#E68A45]' : 'bg-[#1A222C]'}`}>
                <div>
                  <p className="font-bold">{p.title}</p>
                  <p className="text-xs opacity-80">{p.points.substring(0, 40)}...</p>
                </div>
                <button onClick={() => handleDeletePolicy(p.id)} className="bg-white/20 p-2 rounded hover:bg-white/40">Delete</button>
              </div>
            ))}
          </div>
        </section>

      </div>
  
  )
}