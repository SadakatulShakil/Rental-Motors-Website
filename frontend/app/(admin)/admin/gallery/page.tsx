"use client"
import { useState, useEffect } from "react"

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [metaData, setMetaData] = useState({
    header_title: "", header_description: "", header_image: "",
    page_title: "", page_subtitle: ""
  })
  const [uploading, setUploading] = useState(false)
  const [newImage, setNewImage] = useState<{file: File | null, desc: string}>({ file: null, desc: "" })

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [imgRes, metaRes] = await Promise.all([
      fetch("http://localhost:8000/admin/gallery/"),
      fetch("http://localhost:8000/admin/meta/gallery")
    ])
    if (imgRes.ok) setImages(await imgRes.json())
    if (metaRes.ok) setMetaData(await metaRes.json())
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true)
    const data = new FormData(); data.append("image", file)
    
    // Note: ensure this endpoint matches your Gallery or About upload route
    const res = await fetch("http://localhost:8000/admin/about/upload-image", {
      method: "POST", headers: { Authorization: `Bearer ${token}` }, body: data,
    })
    const result = await res.json()
    setMetaData({ ...metaData, header_image: result.url })
    setUploading(false)
  }

  const handleUpload = async () => {
    if (!newImage.file) return alert("Select an image first")
    setUploading(true)
    const formData = new FormData()
    formData.append("image", newImage.file)
    if (newImage.desc) formData.append("description", newImage.desc)

    try {
      const res = await fetch("http://localhost:8000/admin/gallery/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      if (res.ok) {
        setNewImage({ file: null, desc: "" })
        fetchData()
      }
    } catch (err) { alert("Upload failed") }
    finally { setUploading(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this image?")) return
    await fetch(`http://localhost:8000/admin/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
  }

  const handleSaveMeta = async () => {
    await fetch("http://localhost:8000/admin/meta/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(metaData),
    })
    alert("Gallery Header Updated!")
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Gallery</h1>

      {/* 🔹 SECTION 1: UNIVERSAL META (MATCHES INCLUDED PAGE) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-black">Gallery Header & Titles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Banner Title</label>
              <input placeholder="e.g., OUR GALLERY" value={metaData.header_title} onChange={e => setMetaData({...metaData, header_title: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
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

      {/* 🔹 SECTION 2: UPLOAD GALLERY IMAGES */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-black">Add New Gallery Photo</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
             <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Select Image</label>
             <input type="file" onChange={e => setNewImage({...newImage, file: e.target.files?.[0] || null})} className="w-full border p-2 rounded" />
          </div>
          <div className="flex-1 w-full">
             <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Caption / Description</label>
             <input placeholder="e.g., Happy Customer with KTM" value={newImage.desc} onChange={e => setNewImage({...newImage, desc: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <button onClick={handleUpload} disabled={uploading} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-green-900/10 whitespace-nowrap">
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      </div>

      {/* 🔹 SECTION 3: GRID PREVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <img src={img.image} className="h-40 w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(img.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg hover:bg-red-700">
                Delete
                </button>
            </div>
            {img.description && (
                <div className="p-2">
                    <p className="text-xs text-gray-600 truncate">{img.description}</p>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}