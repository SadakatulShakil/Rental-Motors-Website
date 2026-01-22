"use client"
import { useState, useEffect } from "react"

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<any[]>([])
  const [newSlide, setNewSlide] = useState({ title: "", subtitle: "", image_url: "", order: 0 })
  const [uploading, setUploading] = useState(false)

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
    const res = await fetch("http://localhost:8000/admin/about/upload-image", 
        { method: "POST", headers: { Authorization: `Bearer ${token}`}, body: data,
    })
    const result = await res.json()
    setNewSlide({ ...newSlide, image_url: result.url })
    setUploading(false)
  }

  const handleAddSlide = async () => {
    await fetch("http://localhost:8000/admin/hero/slides", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newSlide)
    })
    setNewSlide({ title: "", subtitle: "", image_url: "", order: 0 })
    fetchData()
  }

  const handleDeleteSlide = async (id: number) => {
    // 1. Ask for confirmation
    if (!confirm("Are you sure you want to delete this slide?")) return;
  
    try {
      const res = await fetch(`http://localhost:8000/admin/hero/slides/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include if you are using auth
        },
      });
  
      if (res.ok) {
        // 2. Update UI by filtering out the deleted slide
        setSlides((prev) => prev.filter((slide) => slide.id !== id));
        alert("Slide deleted successfully");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.detail || "Failed to delete slide"}`);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Network error: Could not reach the server.");
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold">Manage Hero Slider</h1>

      {/* Add Slide Section */}
      <div className="bg-white p-6 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Add New Slide</h2>
          <input placeholder="Main Title" value={newSlide.title} onChange={e => setNewSlide({...newSlide, title: e.target.value})} className="w-full border p-2 rounded" />
          <textarea placeholder="Subtitle" value={newSlide.subtitle} onChange={e => setNewSlide({...newSlide, subtitle: e.target.value})} className="w-full border p-2 rounded" rows={2} />
          <input type="number" placeholder="Order" value={newSlide.order} onChange={e => setNewSlide({...newSlide, order: parseInt(e.target.value)})} className="w-full border p-2 rounded" />
          <button onClick={handleAddSlide} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Add Slide</button>
        </div>

        <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50">
          {newSlide.image_url ? (
            <img src={newSlide.image_url} className="h-40 w-full object-cover rounded-lg mb-4" />
          ) : <div className="h-40 flex items-center text-gray-400">No Image Selected</div>}
          <input type="file" onChange={handleUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full" />
        </div>
      </div>

      {/* Current Slides List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {slides.map(slide => (
  <div key={slide.id} className="bg-white rounded-xl overflow-hidden shadow border group relative">
    {/* 🔹 FIX: Only render the img tag if slide.image_url is not empty */}
    {slide.image_url ? (
      <img 
        src={slide.image_url} 
        alt={slide.title} 
        className="h-48 w-full object-cover" 
      />
    ) : (
      /* 🔹 OPTIONAL: Show a placeholder div so the card isn't empty */
      <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400 italic">
        No image provided
      </div>
    )}
    
    <div className="p-4">
      <h3 className="font-bold">{slide.title}</h3>
      <p className="text-sm text-gray-500">{slide.subtitle}</p>
    </div>
    
    <button 
       onClick={() => handleDeleteSlide(slide.id)}
       className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
))}
      </div>
    </div>
  )
}