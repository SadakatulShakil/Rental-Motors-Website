"use client"

import { useEffect, useState } from "react"

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 🔹 Separated into Meta (Universal) and Content (Specific)
  const [metaData, setMetaData] = useState({
    header_title: "",
    header_description: "",
    header_image: "",
    page_title: "",
    page_subtitle: ""
  })

  const [contentData, setContentData] = useState({
    description: "",
    hero_image: ""
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both Meta and About Content
        const [metaRes, contentRes] = await Promise.all([
          fetch("http://localhost:8000/admin/meta/about", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:8000/admin/about", { headers: { Authorization: `Bearer ${token}` } })
        ])
        
        const meta = await metaRes.json()
        const content = await contentRes.json()

        setMetaData(meta)
        setContentData({
          description: content.description || "",
          hero_image: content.hero_image || ""
        })
      } catch (err) {
        console.error("Fetch failed:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const handleImageUpload = async (file: File, target: 'header' | 'hero') => {
    setUploading(true)
    const data = new FormData()
    data.append("image", file)

    try {
      const res = await fetch("http://localhost:8000/admin/about/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      })
      const result = await res.json()
      
      if (target === 'header') setMetaData(prev => ({ ...prev, header_image: result.url }))
      else setContentData(prev => ({ ...prev, hero_image: result.url }))
      
      alert("Image uploaded successfully!")
    } catch (err) {
      alert("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const [metaRes, contentRes] = await Promise.all([
        // 1. Save Meta Data
        fetch("http://localhost:8000/admin/meta/about", {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(metaData),
        }),
        // 2. Save Content Data
        fetch("http://localhost:8000/admin/about", {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(contentData),
        })
      ]);
  
      // Check if BOTH responses are actually 200-299 OK
      if (metaRes.ok && contentRes.ok) {
        alert("All sections updated successfully!");
      } else {
        // If one failed, log which one
        const errorMeta = !metaRes.ok ? "Meta update failed" : "";
        const errorContent = !contentRes.ok ? "Content update failed" : "";
        console.error(errorMeta, errorContent);
        alert(`Partial update: ${errorMeta} ${errorContent}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Update failed: Check your connection or server logs.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <div className="p-10 text-black">Loading...</div>

  return (
    <main className="p-8 bg-gray-100 min-h-screen text-black space-y-8">
      <h2 className="text-3xl font-bold">Edit About Page</h2>

      {/* SECTION 1: UNIVERSAL HEADER */}
      <div className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="text-xl font-semibold mb-4 text-red-600">1. Header Section</h3>
            <label className="block text-sm font-medium mb-1">Header Image</label>
            <input type="file" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'header')} className="mb-4" />
            
            <label className="block text-sm font-medium mb-1">Header Title</label>
            <input type="text" value={metaData.header_title} onChange={e => setMetaData({...metaData, header_title: e.target.value})} className="w-full border p-2 mb-4" />
            
            <label className="block text-sm font-medium mb-1">Header Description</label>
            <textarea value={metaData.header_description} onChange={e => setMetaData({...metaData, header_description: e.target.value})} className="w-full border p-2" rows={3} />
        </div>
        <div className="bg-gray-200 rounded flex items-center justify-center overflow-hidden">
            {metaData.header_image ? <img src={metaData.header_image} alt="Header Preview" className="w-full h-full object-cover" /> : "No Header Image"}
        </div>
      </div>

      {/* SECTION 2: PAGE TITLE & SUBTITLE */}
      <div className="bg-white p-6 rounded shadow">
         <h3 className="text-xl font-semibold mb-4 text-red-600">2. Body Titles</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Page Title (e.g. Our Vision)" type="text" value={metaData.page_title} onChange={e => setMetaData({...metaData, page_title: e.target.value})} className="border p-2" />
            <input placeholder="Page Subtitle" type="text" value={metaData.page_subtitle} onChange={e => setMetaData({...metaData, page_subtitle: e.target.value})} className="border p-2" />
         </div>
      </div>

      {/* SECTION 3: MAIN CONTENT */}
      <div className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="text-xl font-semibold mb-4 text-red-600">3. About Description & Main Image</h3>
            <label className="block text-sm font-medium mb-1">Main Hero Image</label>
            <input type="file" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'hero')} className="mb-4" />
            
            <label className="block text-sm font-medium mb-1">Full Description</label>
            <textarea value={contentData.description} onChange={e => setContentData({...contentData, description: e.target.value})} className="w-full border p-2" rows={8} />
        </div>
        <div className="bg-gray-200 rounded flex items-center justify-center overflow-hidden">
            {contentData.hero_image ? <img src={contentData.hero_image} alt="Hero Preview" className="w-full h-full object-cover" /> : "No Hero Image"}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving || uploading} className="fixed bottom-8 right-8 bg-green-600 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:bg-green-700">
        {saving ? "Saving All..." : "Save All Changes"}
      </button>
    </main>
  )
}