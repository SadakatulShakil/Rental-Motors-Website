"use client"
import { useState, useEffect } from "react"

export default function AdminIncludedPage() {
  const [features, setFeatures] = useState([])
  const [policies, setPolicies] = useState([])
  
  // States for new entries
  const [newFeat, setNewFeat] = useState({ icon_name: "FaMotorcycle", title: "", subtitle: "" })
  const [newPolicy, setNewPolicy] = useState({ title: "", points: "", color_type: "orange" })

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const fRes = await fetch("http://localhost:8000/admin/include/features")
      const pRes = await fetch("http://localhost:8000/admin/include/policies")
      if (fRes.ok) setFeatures(await fRes.json())
      if (pRes.ok) setPolicies(await pRes.json())
    } catch (err) {
      console.error("Failed to fetch content", err)
    }
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-8">Management: What's Included & Policies</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
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
    </div>
  )
}