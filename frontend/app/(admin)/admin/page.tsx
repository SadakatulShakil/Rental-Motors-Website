"use client"
import { useState, useEffect } from "react"
import AdminGuard from "../components/AdminGuard"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_bikes: 0,
    gallery_images: 0,
    hero_slides: 0,
    total_admins: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admin_token")
        const res = await fetch("http://localhost:8000/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <AdminGuard>
      <h2 className="text-3xl font-bold mb-8 text-black">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Bikes" 
          value={loading ? "..." : stats.total_bikes.toString()} 
        />
        <StatCard 
          title="Gallery Images" 
          value={loading ? "..." : stats.gallery_images.toString()} 
        />
        <StatCard 
          title="Hero Slides" 
          value={loading ? "..." : stats.hero_slides.toString()} 
        />
        <StatCard 
          title="Admins" 
          value={loading ? "..." : stats.total_admins.toString()} 
        />
      </div>

      <h3 className="text-xl font-bold mb-4 text-black">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard title="Manage Bikes" href="/admin/bikes" />
        <ActionCard title="Manage Gallery" href="/admin/gallery" />
        <ActionCard title="Edit Home Content" href="/admin/hero" />
        <ActionCard title="Contact Info" href="/admin/contact" />
      </div>
    </AdminGuard>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-hover hover:shadow-md">
      <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">{title}</p>
      <h3 className="text-4xl font-black text-blue-600 mt-2">{value}</h3>
    </div>
  )
}

function ActionCard({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-500 hover:bg-blue-50/30 transition-all group"
    >
      <h3 className="text-xl font-bold text-black group-hover:text-blue-600">{title}</h3>
      <p className="text-gray-500 mt-1">Manage and update section content</p>
    </a>
  )
}