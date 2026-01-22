"use client"
import { useState, useEffect } from "react"

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 🔹 SECTION 1: UNIVERSAL META (Matches Included & Contact Pages)
  const [metaData, setMetaData] = useState({
    header_title: "", 
    header_description: "", 
    header_image: "",
    page_title: "", 
    page_subtitle: ""
  })

  // 🔹 SECTION 2: ABOUT SPECIFIC CONTENT
  const [contentData, setContentData] = useState({
    description: "",
    hero_image: ""
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [mRes, cRes] = await Promise.all([
        fetch("http://localhost:8000/admin/meta/about"),
        fetch("http://localhost:8000/admin/about")
      ])
      if (mRes.ok) setMetaData(await mRes.json())
      if (cRes.ok) {
        const content = await cRes.json()
        setContentData({
          description: content.description || "",
          hero_image: content.hero_image || ""
        })
      }
    } catch (err) {
      console.error("Fetch failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'header' | 'hero') => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true)
    const data = new FormData(); data.append("image", file)
    
    try {
      const res = await fetch("http://localhost:8000/admin/about/upload-image", {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: data,
      })
      const result = await res.json()
      
      if (target === 'header') setMetaData({ ...metaData, header_image: result.url })
      else setContentData({ ...contentData, hero_image: result.url })
      
      alert("Image uploaded!")
    } catch (err) {
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await Promise.all([
        fetch("http://localhost:8000/admin/meta/about", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(metaData),
        }),
        fetch("http://localhost:8000/admin/about", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(contentData),
        })
      ])
      alert("About Page Successfully Updated!")
    } catch (err) {
      alert("Update failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-10 text-black animate-pulse">Loading About Settings...</div>

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage About Page</h1>

      {/* 🔹 SECTION 1: UNIVERSAL META (Header & Titles) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-black flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          Header & Page Titles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Banner Title</label>
              <input placeholder="e.g., ABOUT OUR FLEET" value={metaData.header_title} onChange={e => setMetaData({...metaData, header_title: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
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
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 transition-hover hover:border-blue-400">
            {metaData.header_image ? (
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden shadow-inner">
                 <img src={metaData.header_image} className="w-full h-full object-cover" alt="Preview" />
              </div>
            ) : (
              <div className="h-40 flex items-center text-gray-400 italic">No banner image uploaded</div>
            )}
            <input type="file" onChange={(e) => handleImageUpload(e, 'header')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full" />
          </div>
        </div>
      </div>

      {/* 🔹 SECTION 2: ABOUT CONTENT (Description & Main Image) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-black flex items-center gap-2">
          <span className="w-2 h-6 bg-green-600 rounded-full"></span>
          Main About Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Biography / Description</label>
            <textarea 
              placeholder="Tell your story here..." 
              value={contentData.description} 
              onChange={e => setContentData({...contentData, description: e.target.value})} 
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" 
              rows={10} 
            />
          </div>

          <div className="space-y-4">
             <label className="block text-xs font-bold uppercase text-gray-500 mb-1">About Page Feature Image</label>
             <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50">
                {contentData.hero_image ? (
                  <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                     <img src={contentData.hero_image} className="w-full h-full object-cover" alt="Hero Preview" />
                  </div>
                ) : (
                  <div className="h-64 flex items-center text-gray-400 italic">No feature image uploaded</div>
                )}
                <input type="file" onChange={(e) => handleImageUpload(e, 'hero')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full" />
             </div>
          </div>
        </div>
      </div>

      {/* 🔹 FLOATING SAVE BUTTON */}
      <button 
        onClick={handleSaveAll} 
        disabled={saving || uploading}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:bg-gray-400"
      >
        {saving ? "Saving Changes..." : "Save About Page"}
      </button>
    </div>
  )
}