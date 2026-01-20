"use client"

import { useEffect, useState } from "react"
import AdminGuard from "../../components/AdminGuard"
import AdminNavbar from "../../components/AdminNavBar"

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [description, setDescription] = useState("")

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null

  // 🔹 Load existing about data
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("http://localhost:8000/admin/about", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        setHeroImage(data.hero_image)
        setTitle(data.title)
        setSubtitle(data.subtitle)
        setDescription(data.description)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAbout()
  }, [token])

  // 🔹 Upload image instantly
  const handleImageUpload = async () => {
    if (!imageFile) return

    const formData = new FormData()
    formData.append("image", imageFile)

    const res = await fetch(
      "http://localhost:8000/admin/about/upload-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )

    const data = await res.json()
    setHeroImage(data.url)
    setImageFile(null)
  }

  // 🔹 Save text content
const handleSave = async () => {
    if (!title || !subtitle || !description) {
      alert("Please fill in all fields");
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch("http://localhost:8000/admin/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          subtitle,
          description,
          hero_image: heroImage, // Send the uploaded image URL too
        }),
      });
      
      if (res.ok) {
        alert("About section updated successfully!");
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="p-10 text-black">Loading...</div>
    )
  }

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
    <h2 className="text-3xl font-bold text-black mb-8">
      About Section
    </h2>

    {/* HERO IMAGE */}
    <div className="bg-white p-6 rounded shadow mb-8">
      <h3 className="text-xl font-semibold mb-4 text-black">
        Hero Image
      </h3>

      {heroImage && (
        <img
          src={heroImage}
          alt="About Hero"
          className="w-full max-w-lg rounded mb-4"
        />
      )}


      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleImageUpload}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload Image
      </button>
    </div>

    {/* TEXT CONTENT */}
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4 text-black">
        About Content
      </h3>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-3 rounded mb-4 text-black"
      />

      <input
        type="text"
        placeholder="Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        className="w-full border p-3 rounded mb-4 text-black"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
        className="w-full border p-3 rounded mb-6 text-black"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  </main>
  )
}
