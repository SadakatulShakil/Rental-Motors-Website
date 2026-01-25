"use client"
import { useState, useEffect } from "react"

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<any[]>([])
  const [newSlide, setNewSlide] = useState({ title: "", subtitle: "", image_url: "", order: 0 })
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null) // 🔹 Track which slide is being edited

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  const fetchData = async () => {
    const res = await fetch("http://localhost:8000/admin/hero/slides")
    if (res.ok) setSlides(await res.json())
  }

  useEffect(() => { fetchData() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true)
    const data = new FormData(); data.append("image", file)
    const res = await fetch("http://localhost:8000/admin/about/upload-image", { 
        method: "POST", headers: { Authorization: `Bearer ${token}`}, body: data 
    })
    const result = await res.json()
    setNewSlide({ ...newSlide, image_url: result.url })
    setUploading(false)
  }

  // 🔹 New: Handle both Add and Update
  const handleSubmit = async () => {
    const url = editingId 
        ? `http://localhost:8000/admin/hero/slides/${editingId}` 
        : "http://localhost:8000/admin/hero/slides";
    
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newSlide)
    })

    if (res.ok) {
        setNewSlide({ title: "", subtitle: "", image_url: "", order: 0 })
        setEditingId(null)
        fetchData()
    }
  }

  const startEdit = (slide: any) => {
    setEditingId(slide.id)
    setNewSlide({ 
        title: slide.title, 
        subtitle: slide.subtitle, 
        image_url: slide.image_url, 
        order: slide.order 
    })
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll up to the form
  }

  const handleDeleteSlide = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`http://localhost:8000/admin/hero/slides/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    fetchData()
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold">Manage Hero Slider</h1>

      {/* Form Section (Dual Purpose) */}
      <div className={`p-6 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm transition-colors ${editingId ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{editingId ? "Edit Slide" : "Add New Slide"}</h2>
          <input placeholder="Main Title" value={newSlide.title} onChange={e => setNewSlide({...newSlide, title: e.target.value})} className="w-full border p-2 rounded" />
          <textarea placeholder="Subtitle" value={newSlide.subtitle} onChange={e => setNewSlide({...newSlide, subtitle: e.target.value})} className="w-full border p-2 rounded" rows={2} />
          <input type="number" placeholder="Order" value={newSlide.order} onChange={e => setNewSlide({...newSlide, order: parseInt(e.target.value)})} className="w-full border p-2 rounded" />
          
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                {editingId ? "Update Slide" : "Add Slide"}
            </button>
            {editingId && (
                <button onClick={() => {setEditingId(null); setNewSlide({title:"", subtitle:"", image_url:"", order:0})}} className="bg-gray-500 text-white px-6 py-2 rounded-lg font-bold">
                    Cancel
                </button>
            )}
          </div>
        </div>

        <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50">
          {newSlide.image_url ? (
            <img src={newSlide.image_url} className="h-40 w-full object-cover rounded-lg mb-4" />
          ) : <div className="h-40 flex items-center text-gray-400">No Image Selected</div>}
          <input type="file" onChange={handleUpload} className="text-sm cursor-pointer w-full" />
          {uploading && <p className="text-blue-600 text-xs mt-2">Uploading...</p>}
        </div>
      </div>

      {/* List Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {slides.map(slide => (
          <div key={slide.id} className="bg-white rounded-xl overflow-hidden shadow border group relative">
            {slide.image_url ? (
              <img src={slide.image_url} alt={slide.title} className="h-48 w-full object-cover" />
            ) : <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400 italic">No image</div>}
            
            <div className="p-4">
              <h3 className="font-bold">{slide.title}</h3>
              <p className="text-sm text-gray-500">{slide.subtitle}</p>
            </div>
            
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Edit Button */}
              <button onClick={() => startEdit(slide)} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              {/* Delete Button */}
              <button onClick={() => handleDeleteSlide(slide.id)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}