"use client"
import { useEffect, useState } from "react"
import { 
  Save, Upload, Bike, Layout, Trash2, 
  Loader2, Plus, Edit2, X, Settings, DollarSign, 
  Image as ImageIcon 
} from "lucide-react"

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editSlug, setEditSlug] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  const [metaData, setMetaData] = useState({
    header_title: "", header_description: "", header_image: "",
    page_title: "", page_subtitle: ""
  })

  const initialForm = {
    name: "", price: "", cc: "", fuel: "", topSpeed: "", description: "", image: "",
    year_mf: "", fuel_use: "", color: "", max_passengers: 2, transmission: "Manual", type: "Sports",
    rental_charges: [
      { duration: "1 Day", charge: "", max_km: "120 KM", extra_charge: "20" },
      { duration: "7 Days", charge: "", max_km: "500 KM", extra_charge: "15" },
      { duration: "2 Weeks", charge: "", max_km: "900 KM", extra_charge: "12" },
      { duration: "1 Month", charge: "", max_km: "1200 KM", extra_charge: "10" }
    ]
  }
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [metaRes, bikesRes] = await Promise.all([
        fetch(`${apiUrl}/admin/meta/bikes`),
        fetch(`${apiUrl}/admin/bikes`)
      ])
      if (metaRes.ok) setMetaData(await metaRes.json())
      if (bikesRes.ok) setBikes(await bikesRes.json())
    } finally { setFetching(false) }
  }

  const handleImageUpload = async (file: File, isHeader: boolean) => {
    setUploading(true)
    const data = new FormData(); 
    data.append("file", file);
    try {
        const res = await fetch(`${apiUrl}/admin/about/upload-image`, {
            method: "POST", 
            headers: { Authorization: `Bearer ${token}` }, 
            body: data,
        })
        const result = await res.json()
        if (isHeader) setMetaData({ ...metaData, header_image: result.url })
        else setFormData({ ...formData, image: result.url })
        
        // 🔔 User Feedback
        alert("✅ Image Uploaded! Remember to click the 'Update Header' button below to store it permanently.");
    } catch (err) {
        alert("❌ Upload failed. Check your connection.");
    } finally { setUploading(false) }
  }

  const handleSaveBike = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const method = editSlug ? "PUT" : "POST"
    const url = editSlug ? `${apiUrl}/admin/bikes/${editSlug}` : `${apiUrl}/admin/bikes/`
    const slug = formData.name.toLowerCase().replace(/ /g, "-")

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...formData, slug }),
    })

    if (res.ok) {
      alert("✅ Vehicle data synchronized.");
      setEditSlug(null); setIsAdding(false); setFormData(initialForm);
      fetchData();
    }
    setLoading(false)
  }

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Remove this bike?")) return
    await fetch(`${apiUrl}/admin/bikes/${slug}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    })
    fetchData()
  }

  if (fetching) return <div className="p-10 text-center animate-pulse italic font-black text-slate-900">Syncing Fleet...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 space-y-12 mb-20">
      
      {/* 1. HEADER & META SECTION */}
      {!isAdding && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-end border-b pb-6">
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Fleet Meta</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Banner Settings</p>
            </div>
            <button onClick={async () => {
              await fetch(`${apiUrl}/admin/meta/bikes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(metaData),
              });
              alert("Banner Updated!");
            }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black italic text-[10px] uppercase shadow-lg shadow-blue-600/20">
                Update Header
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <AdminInput label="Banner Title" value={metaData.header_title} onChange={(e:any) => setMetaData({...metaData, header_title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Page Title" value={metaData.page_title} onChange={(e:any) => setMetaData({...metaData, page_title: e.target.value})} />
                <AdminInput label="Page Subtitle" value={metaData.page_subtitle} onChange={(e:any) => setMetaData({...metaData, page_subtitle: e.target.value})} />
              </div>
            </div>
            <div className="border-2 border-dashed border-slate-100 rounded-3xl p-4 bg-slate-50 flex flex-col items-center">
               {metaData.header_image ? <img src={metaData.header_image} className="h-32 w-full object-cover rounded-2xl mb-4" /> : <div className="h-32 w-full bg-white rounded-2xl mb-4" />}
               <label className="w-full cursor-pointer">
                  <div className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl font-black italic text-[10px] uppercase">
                     <Upload size={14} /> Replace Banner
                  </div>
                  <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)} />
               </label>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD/EDIT FORM (HIDDEN UNTIL TRIGGERED) */}
      {isAdding && (
        <form onSubmit={handleSaveBike} className="space-y-10 bg-slate-950 p-10 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
                {editSlug ? "Update Vehicle" : "New Vehicle Details"}
            </h2>
            <div className="flex gap-4">
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 font-black italic text-[10px] uppercase">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black italic uppercase text-xs">
                {loading ? <Loader2 className="animate-spin" /> : "Confirm & Save"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <AdminInputDark label="Bike Name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
                <AdminInputDark label="Base Price" value={formData.price} onChange={(e:any) => setFormData({...formData, price: e.target.value})} />
              </div>
              <textarea className="w-full bg-slate-900 border-b border-slate-800 text-white p-4 font-bold outline-none rounded-xl" placeholder="Description..." rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative group">
                {formData.image ? <img src={formData.image} className="h-40 object-contain" /> : <ImageIcon size={48} className="text-slate-800" />}
                <label className="absolute inset-0 flex items-center justify-center bg-blue-600/80 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-3xl">
                    <Upload className="text-white" />
                    <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], false)} />
                </label>
            </div>
          </div>
        </form>
      )}

      {/* 3. LIST TABLE SECTION (WITH NEW BUTTON POSITION) */}
      {!isAdding && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <SectionHeader icon={<Settings size={18}/>} title="Active Fleet Inventory" />
            <button 
                onClick={() => { setIsAdding(true); setEditSlug(null); setFormData(initialForm); }} 
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black italic flex items-center gap-2 hover:bg-blue-600 transition-all text-[10px] uppercase shadow-xl"
            >
                <Plus size={16}/> Add New Vehicle
            </button>
          </div>

          <div className="overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-sm">
            <table className="w-full text-left bg-white">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Model</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rate</th>
                  <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bikes.map((bike) => (
                  <tr key={bike.slug} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                    <td className="p-6 flex items-center gap-5">
                       <img src={bike.image} className="w-20 h-12 object-contain bg-slate-50 rounded-lg p-2" />
                       <p className="font-black uppercase italic text-slate-900 text-sm">{bike.name}</p>
                    </td>
                    <td className="p-6 font-black text-blue-600 italic">{bike.price}</td>
                    <td className="p-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditSlug(bike.slug); setFormData(bike); setIsAdding(true); }} className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(bike.slug)} className="p-3 bg-red-50 text-red-500 rounded-xl"><Trash2 size={16}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// SHARED COMPONENTS
const SectionHeader = ({ icon, title }: any) => (
  <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
    <div className="text-blue-600">{icon}</div>
    <h2 className="text-sm font-black uppercase italic tracking-widest text-slate-900">{title}</h2>
  </div>
);

const AdminInput = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <input {...props} className="w-full border-b-2 border-slate-100 py-3 font-bold outline-none focus:border-blue-600 transition-all text-slate-900 bg-transparent text-sm" />
  </div>
);

const AdminInputDark = ({ label, ...props }: any) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
      <input {...props} className="w-full bg-slate-900/50 border-b border-slate-800 py-3 px-4 font-bold outline-none focus:border-blue-600 transition-all text-white rounded-t-xl" />
    </div>
);