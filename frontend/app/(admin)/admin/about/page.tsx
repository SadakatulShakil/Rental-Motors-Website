"use client"

import { useEffect, useState } from "react"
export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 🔹 Use a single state object to keep things synced
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    hero_image: ""
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("http://localhost:8000/admin/about", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          hero_image: data.hero_image || ""
        })
      } catch (err) {
        console.error("Fetch failed:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAbout()
  }, [token])

  // 🔹 Handle Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      
      // Update the hero_image in our main state
      setFormData(prev => ({ ...prev, hero_image: result.url }))
      alert("Image uploaded! Don't forget to Save Changes.")
    } catch (err) {
      alert("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("http://localhost:8000/admin/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // Sends everything including the new URL
      })
      
      if (res.ok) {
        alert("PostgreSQL Database Updated Successfully!")
      }
    } catch (err) {
      alert("Update failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-10 text-black">Loading...</div>

  return (
    <main className="p-8 bg-gray-100 min-h-screen text-black">
      <h2 className="text-3xl font-bold mb-8">Edit About Section</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Image Preview */}
        <div className="bg-white p-6 rounded shadow col-span-1">
          <h3 className="text-xl font-semibold mb-4">Hero Image</h3>
          <div className="relative aspect-video bg-gray-200 rounded overflow-hidden mb-4">
            {formData.hero_image ? (
              <img src={formData.hero_image} alt="Preview" className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageFileChange} className="text-sm" />
          {uploading && <p className="text-blue-500 mt-2 text-sm">Uploading...</p>}
        </div>

        {/* Right Column: Text Content */}
        <div className="bg-white p-6 rounded shadow col-span-2">
          <h3 className="text-xl font-semibold mb-4">Text Content</h3>
          
          <label className="block mb-2 text-sm font-medium">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full border p-3 rounded mb-4"
          />

          <label className="block mb-2 text-sm font-medium">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
            className="w-full border p-3 rounded mb-4"
          />

          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={5}
            className="w-full border p-3 rounded mb-6"
          />

          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="bg-green-600 text-white px-8 py-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
          >
            {saving ? "Saving to Database..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </main>
  )
}
