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

  const handleTableChange = (index: number, field: string, value: string) => {
    const updatedCharges = [...formData.rental_charges]
    updatedCharges[index] = { ...updatedCharges[index], [field]: value }
    setFormData({ ...formData, rental_charges: updatedCharges })
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
              <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Banner Description</label>
            <textarea 
              value={metaData.header_description} 
              onChange={(e:any) => setMetaData({...metaData, header_description: e.target.value})} 
              rows={2} 
              className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all resize-none shadow-sm" 
            />
          </div>
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

{/* SECTION 2: ADD/EDIT FORM */}
{isAdding && (
        <form onSubmit={handleSaveBike} className="space-y-10 bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between">
            <SectionHeader icon={<Bike size={18}/>} title={editSlug ? "Edit Vehicle Details" : "New Vehicle Entry"} />
            <div className="flex gap-4">
               {uploading && <Loader2 className="animate-spin text-blue-600" />}
               <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black italic uppercase text-xs shadow-lg shadow-blue-600/20">Confirm Save</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-6">
              <AdminInput label="Bike Name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} placeholder="e.g. KTM Duke 390" />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Base Price (£)" value={formData.price.replace("£", "")} onChange={(e:any) => setFormData({...formData, price: e.target.value})} />
                <AdminInput label="Engine CC" value={formData.cc} onChange={(e:any) => setFormData({...formData, cc: e.target.value})} />
              </div>
            </div>

            <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-[2rem] p-4 bg-white flex flex-col items-center justify-center relative group">
                {formData.image ? (
                  <img src={formData.image} className="h-32 object-contain" />
                ) : (
                  <ImageIcon size={40} className="text-slate-200" />
                )}
                <label className="absolute bottom-4 right-4 cursor-pointer bg-slate-900 text-white p-3 rounded-full shadow-xl hover:bg-blue-600 transition-all">
                  <Upload size={16} />
                  <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], false)} />
                </label>
            </div>
          </div>

          {/* Detailed Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <AdminInput label="Manufacturing Year" value={formData.year_mf} onChange={(e:any) => setFormData({...formData, year_mf: e.target.value})} />
            <AdminInput label="Color / Finish" value={formData.color} onChange={(e:any) => setFormData({...formData, color: e.target.value})} />
            <AdminInput label="Vehicle Type" value={formData.type} onChange={(e:any) => setFormData({...formData, type: e.target.value})} />
            <AdminInput label="Transmission" value={formData.transmission} onChange={(e:any) => setFormData({...formData, transmission: e.target.value})} />
            <AdminInput label="Top Speed" value={formData.topSpeed} onChange={(e:any) => setFormData({...formData, topSpeed: e.target.value})} />
            <AdminInput label="Fuel Type" value={formData.fuel_use} onChange={(e:any) => setFormData({...formData, fuel_use: e.target.value})} />
            <AdminInput label="Fuel Capacity" value={formData.fuel} onChange={(e:any) => setFormData({...formData, fuel: e.target.value})} />
            <AdminInput type="number" label="Max Passengers" value={formData.max_passengers} onChange={(e:any) => setFormData({...formData, max_passengers: parseInt(e.target.value)})} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Bike Description</label>
            <textarea className="w-full border-2 border-slate-100 rounded-3xl p-6 font-bold outline-none focus:border-blue-600 transition-all resize-none bg-white" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          {/* RENTAL PRICING TABLE */}
          <div className="space-y-6 bg-slate-950 p-8 rounded-[3rem] shadow-2xl shadow-slate-900/30">
            <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4">
              <DollarSign className="text-blue-500" size={18}/>
              <h4 className="text-xs font-black uppercase italic text-white tracking-[0.2em]">Rental Rate Tiers (Numbers Only)</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <span>Time Period</span><span>Rate (£)</span><span>KM Limit</span><span>Extra Charge (£/KM)</span>
            </div>

            {formData.rental_charges.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="text-white font-black italic text-sm">{row.duration}</div>
                <input value={row.charge.replace("£", "")} onChange={e => handleTableChange(idx, "charge", e.target.value)} className="bg-slate-900 border-b border-slate-700 text-blue-400 font-bold p-2 outline-none focus:border-blue-500" placeholder="0.00" />
                <input value={row.max_km} onChange={e => handleTableChange(idx, "max_km", e.target.value)} className="bg-slate-900 border-b border-slate-700 text-white font-bold p-2 outline-none focus:border-blue-500" placeholder="e.g. 100 KM" />
                <input value={row.extra_charge.replace("£", "").replace(" / KM", "")} onChange={e => handleTableChange(idx, "extra_charge", e.target.value)} className="bg-slate-900 border-b border-slate-700 text-slate-400 font-bold p-2 outline-none focus:border-blue-500" placeholder="0.00" />
              </div>
            ))}
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