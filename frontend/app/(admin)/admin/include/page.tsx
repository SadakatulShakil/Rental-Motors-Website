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

  // States for new entries & Editing
  const [newFeat, setNewFeat] = useState({ icon_name: "FaMotorcycle", title: "", subtitle: "" })
  const [newPolicy, setNewPolicy] = useState({ title: "", points: "", color_type: "orange" })
  const [editFeatId, setEditFeatId] = useState<number | null>(null)
  const [editPolicyId, setEditPolicyId] = useState<number | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [fRes, pRes, mRes] = await Promise.all([
        fetch("http://localhost:8000/admin/include/features"),
        fetch("http://localhost:8000/admin/include/policies"),
        fetch("http://localhost:8000/admin/meta/include")
      ])
      if (fRes.ok) setFeatures(await fRes.json())
      if (pRes.ok) setPolicies(await pRes.json())
      if (mRes.ok) setMetaData(await mRes.json())
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  // --- Feature Actions (Add & Update) ---
  const handleSaveFeature = async () => {
    if (!newFeat.title) return alert("Title is required")
    
    const method = editFeatId ? "PUT" : "POST"
    const url = editFeatId 
      ? `http://localhost:8000/admin/include/features/${editFeatId}`
      : "http://localhost:8000/admin/include/features"

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newFeat)
    })

    if (res.ok) {
      setNewFeat({ icon_name: "FaMotorcycle", title: "", subtitle: "" })
      setEditFeatId(null)
      fetchData()
    }
  }

  const startEditFeature = (f: any) => {
    setEditFeatId(f.id)
    setNewFeat({ icon_name: f.icon_name, title: f.title, subtitle: f.subtitle })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteFeature = async (id: number) => {
    if (!confirm("Delete this feature?")) return
    await fetch(`http://localhost:8000/admin/include/features/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
  }

  // --- Policy Actions (Add & Update) ---
  const handleSavePolicy = async () => {
    if (!newPolicy.title || !newPolicy.points) return alert("Fill all policy fields")
    
    const method = editPolicyId ? "PUT" : "POST"
    const url = editPolicyId 
      ? `http://localhost:8000/admin/include/policies/${editPolicyId}`
      : "http://localhost:8000/admin/include/policies"

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newPolicy)
    })

    if (res.ok) {
      setNewPolicy({ title: "", points: "", color_type: "orange" })
      setEditPolicyId(null)
      fetchData()
    }
  }

  const startEditPolicy = (p: any) => {
    setEditPolicyId(p.id)
    setNewPolicy({ title: p.title, points: p.points, color_type: p.color_type })
  }

  const handleDeletePolicy = async (id: number) => {
    if (!confirm("Delete this policy card?")) return
    await fetch(`http://localhost:8000/admin/include/policies/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
  }

  // --- Meta Actions ---
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
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Manage "What's Included"</h1>
        <p className="text-slate-500">Configure page headers, features, and policies.</p>
      </header>
      
      {/* 🔹 SECTION 1: UNIVERSAL META */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6">Header & Page Titles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <input placeholder="Banner Title" value={metaData.header_title} onChange={e => setMetaData({...metaData, header_title: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            <textarea placeholder="Header Description" value={metaData.header_description} onChange={e => setMetaData({...metaData, header_description: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" rows={2} />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Section Title" value={metaData.page_title} onChange={e => setMetaData({...metaData, page_title: e.target.value})} className="w-full border p-2 rounded" />
              <input placeholder="Section Subtitle" value={metaData.page_subtitle} onChange={e => setMetaData({...metaData, page_subtitle: e.target.value})} className="w-full border p-2 rounded" />
            </div>
            <button onClick={handleSaveMeta} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              Save Header Settings
            </button>
          </div>
  
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50">
            {metaData.header_image ? (
              <img src={metaData.header_image} className="w-full h-40 object-cover rounded-lg mb-4" alt="Preview" />
            ) : <div className="h-40 flex items-center text-gray-400">No image uploaded</div>}
            <input type="file" onChange={handleImageUpload} className="text-sm w-full" />
            {uploading && <span className="text-blue-600 text-xs mt-2">Uploading...</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 🔹 SECTION 2: FEATURES */}
        <section className="space-y-4">
          <div className={`p-6 rounded-xl shadow-md border-t-4 ${editFeatId ? 'bg-blue-50 border-blue-500' : 'bg-white border-red-600'}`}>
            <h2 className="text-xl font-bold mb-4">{editFeatId ? "Edit Feature" : "Add Feature Icon"}</h2>
            <div className="space-y-3">
              <input placeholder="Icon (e.g. FaShieldAlt)" className="w-full border p-2 rounded" value={newFeat.icon_name} onChange={e => setNewFeat({...newFeat, icon_name: e.target.value})} />
              <input placeholder="Title" className="w-full border p-2 rounded" value={newFeat.title} onChange={e => setNewFeat({...newFeat, title: e.target.value})} />
              <textarea placeholder="Subtitle" className="w-full border p-2 rounded" value={newFeat.subtitle} onChange={e => setNewFeat({...newFeat, subtitle: e.target.value})} />
              <div className="flex gap-2">
                <button onClick={handleSaveFeature} className={`flex-1 font-bold py-2 rounded text-white ${editFeatId ? 'bg-blue-600' : 'bg-red-600'}`}>
                  {editFeatId ? "Update Feature" : "Add Feature"}
                </button>
                {editFeatId && <button onClick={() => {setEditFeatId(null); setNewFeat({icon_name:"FaMotorcycle", title:"", subtitle:""})}} className="px-4 bg-gray-400 text-white rounded">Cancel</button>}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {features.map((f: any) => (
              <div key={f.id} className="p-4 bg-white border rounded-lg flex justify-between items-center group shadow-sm">
                <div>
                  <p className="font-bold text-red-600 text-xs uppercase">{f.icon_name}</p>
                  <p className="font-semibold">{f.title}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditFeature(f)} className="text-blue-600 font-bold text-sm px-2 py-1 hover:bg-blue-50 rounded">Edit</button>
                  <button onClick={() => handleDeleteFeature(f.id)} className="text-red-500 font-bold text-sm px-2 py-1 hover:bg-red-50 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🔹 SECTION 3: POLICIES */}
        <section className="space-y-4">
          <div className={`p-6 rounded-xl shadow-md border-t-4 ${editPolicyId ? 'bg-blue-50 border-blue-500' : 'bg-white border-black'}`}>
            <h2 className="text-xl font-bold mb-4">{editPolicyId ? "Edit Policy" : "Add Policy Card"}</h2>
            <div className="space-y-3">
              <input placeholder="Policy Title" className="w-full border p-2 rounded" value={newPolicy.title} onChange={e => setNewPolicy({...newPolicy, title: e.target.value})} />
              <textarea placeholder="Points (comma separated)" className="w-full border p-2 rounded h-24" value={newPolicy.points} onChange={e => setNewPolicy({...newPolicy, points: e.target.value})} />
              <div className="flex gap-4 text-sm font-medium">
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={newPolicy.color_type === 'orange'} onChange={() => setNewPolicy({...newPolicy, color_type: 'orange'})} /> Orange</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={newPolicy.color_type === 'dark'} onChange={() => setNewPolicy({...newPolicy, color_type: 'dark'})} /> Dark</label>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSavePolicy} className={`flex-1 font-bold py-2 rounded text-white ${editPolicyId ? 'bg-blue-600' : 'bg-black'}`}>
                  {editPolicyId ? "Update Policy" : "Add Policy"}
                </button>
                {editPolicyId && <button onClick={() => {setEditPolicyId(null); setNewPolicy({title:"", points:"", color_type:"orange"})}} className="px-4 bg-gray-400 text-white rounded">Cancel</button>}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {policies.map((p: any) => (
              <div key={p.id} className={`p-4 border rounded-lg flex justify-between items-center text-white group ${p.color_type === 'orange' ? 'bg-[#E68A45]' : 'bg-[#1A222C]'}`}>
                <div>
                  <p className="font-bold">{p.title}</p>
                  <p className="text-[10px] opacity-70 truncate max-w-[200px]">{p.points}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditPolicy(p)} className="bg-white/20 px-2 py-1 rounded text-xs hover:bg-white/40 transition-colors">Edit</button>
                  <button onClick={() => handleDeletePolicy(p.id)} className="bg-white/20 px-2 py-1 rounded text-xs hover:bg-white/40 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}