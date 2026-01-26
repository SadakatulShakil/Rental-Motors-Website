"use client"
import { useState, useEffect } from "react"
import { 
  Bike, Image as ImageIcon, Layers, Users, 
  ChevronRight, ArrowUpRight, Activity, 
  PlusCircle, Settings, Phone, Loader2
} from "lucide-react"
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
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* WELCOME HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
              Command Center
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Real-time Fleet & Content Analytics
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl border border-blue-100 font-black italic text-xs uppercase">
            <Activity size={14} className="animate-pulse" /> System Operational
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Fleet" 
            value={stats.total_bikes} 
            loading={loading} 
            icon={<Bike size={20}/>}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard 
            title="Gallery Assets" 
            value={stats.gallery_images} 
            loading={loading} 
            icon={<ImageIcon size={20}/>}
            color="text-red-600"
            bg="bg-red-50"
          />
          <StatCard 
            title="Slider Hero" 
            value={stats.hero_slides} 
            loading={loading} 
            icon={<Layers size={20}/>}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <StatCard 
            title="Staff Access" 
            value={stats.total_admins} 
            loading={loading} 
            icon={<Users size={20}/>}
            color="text-slate-900"
            bg="bg-slate-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QUICK ACTIONS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-slate-900 pl-4">
              <h2 className="text-sm font-black uppercase italic tracking-widest text-slate-900">Rapid Management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionCard 
                title="Fleet Management" 
                subtitle="Add, remove or edit motorcycle listings"
                href="/admin/bikes" 
                icon={<Bike />}
              />
              <ActionCard 
                title="Media Gallery" 
                subtitle="Upload and curate brand photography"
                href="/admin/gallery" 
                icon={<ImageIcon />}
              />
              <ActionCard 
                title="Front-Page Hero" 
                subtitle="Configure the main landing slider"
                href="/admin/hero" 
                icon={<Layers />}
              />
              <ActionCard 
                title="Contact & Meta" 
                subtitle="Update phone, email, and SEO titles"
                href="/admin/contact" 
                icon={<Phone />}
              />
            </div>
          </div>

          {/* SIDEBAR / SYSTEM INFO */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-slate-900/30">
            <h3 className="text-xs font-black uppercase italic tracking-widest text-slate-500">System Information</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-[11px] font-bold">
                    <span className="text-slate-500 uppercase">Framework</span>
                    <span className="italic">Next.js 14 (App Router)</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-[11px] font-bold">
                    <span className="text-slate-500 uppercase">API Status</span>
                    <span className="text-green-400 italic font-black">Online</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-[11px] font-bold">
                    <span className="text-slate-500 uppercase">Database</span>
                    <span className="italic">PostgreSQL (Connected)</span>
                </div>
            </div>
            <div className="pt-4">
                <a href="/" target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-950 rounded-2xl transition-all font-black italic text-[10px] uppercase">
                    View Live Site <ArrowUpRight size={14} />
                </a>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}

function StatCard({ title, value, loading, icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 group hover:border-blue-200 transition-all relative overflow-hidden">
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${bg} rounded-full opacity-0 group-hover:opacity-40 transition-all scale-50 group-hover:scale-100`} />
      
      <div className="flex justify-between items-start relative z-10">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</p>
        <div className={`${color}`}>{icon}</div>
      </div>
      
      <div className="mt-4 relative z-10">
        {loading ? (
          <Loader2 className="animate-spin text-slate-200" size={30} />
        ) : (
          <h3 className={`text-5xl font-black italic tracking-tighter ${color}`}>
            {value.toString().padStart(2, '0')}
          </h3>
        )}
      </div>
    </div>
  )
}

function ActionCard({ title, subtitle, href, icon }: any) {
  return (
    <a
      href={href}
      className="bg-white rounded-[2rem] border border-slate-100 p-6 hover:border-slate-900 hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex items-start gap-5"
    >
      <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-black uppercase italic text-slate-900 group-hover:text-blue-600 transition-colors">
            {title}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight leading-tight">
            {subtitle}
        </p>
      </div>
      <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-900 transition-colors mt-1" />
    </a>
  )
}