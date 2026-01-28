"use client"
import { useState, useEffect } from "react"
import { 
  Save, Upload, Trash2, Loader2, 
  Edit2, X, Plus, Layers, Image as ImageIcon,
  ArrowUpCircle, LayoutPanelTop
} from "lucide-react"

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<any[]>([])
  const [newSlide, setNewSlide] = useState({ title: "", subtitle: "", image_url: "", order: 0 })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/hero/slides`)
      if (res.ok) setSlides(await res.json())
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true)
    const data = new FormData(); data.append("image", file)
    const res = await fetch(`{}/admin/about/upload-image`, { 
        method: "POST", headers: { Authorization: `Bearer ${token}`}, body: data 
    })
    const result = await res.json()
    setNewSlide({ ...newSlide, image_url: result.url })
    setUploading(false)
  }

  const handleSubmit = async () => {
    if (!newSlide.title || !newSlide.image_url) return alert("Title and Image are required")
    setLoading(true)
    const url = editingId 
        ? `${apiUrl}/admin/hero/slides/${editingId}` 
        : `${apiUrl}/admin/hero/slides`;
    
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newSlide)
    })

    if (res.ok) {
        setNewSlide({ title: "", subtitle: "", image_url: "", order: 0 })
        setEditingId(null)
        fetchData()
    }
    setLoading(false)
  }

  const startEdit = (slide: any) => {
    setEditingId(slide.id)
    setNewSlide({ 
        title: slide.title, 
        subtitle: slide.subtitle, 
        image_url: slide.image_url, 
        order: slide.order 
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteSlide = async (id: number) => {
    if (!confirm("Remove this slide from the homepage?")) return;
    await fetch(`${apiUrl}/admin/hero/slides/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    fetchData()
  };

  if (fetching) return <div className="p-10 text-center animate-pulse italic font-black text-slate-900">Syncing Slider...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 space-y-12 mb-20">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Hero Slider</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Homepage Banner Management</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
           <Layers size={16} className="text-blue-600" />
           <span className="text-[10px] font-black uppercase text-slate-600">{slides.length} Active Slides</span>
        </div>
      </div>

      {/* SECTION 1: SLIDE BUILDER */}
      <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${editingId ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-950 border-slate-900 shadow-2xl shadow-slate-900/10'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
                <SectionHeader 
                    icon={editingId ? <Edit2 size={18}/> : <Plus size={18}/>} 
                    title={editingId ? "Modify Slide" : "Create New Slide"} 
                    dark={!editingId}
                />
                
                <AdminInput 
                    label="Slide Heading" 
                    value={newSlide.title} 
                    onChange={(e:any) => setNewSlide({...newSlide, title: e.target.value})} 
                    dark={!editingId}
                />
                
                <div className="flex flex-col gap-2">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${editingId ? 'text-slate-400' : 'text-slate-500'}`}>Sub-Heading / Description</label>
                    <textarea 
                        value={newSlide.subtitle} 
                        onChange={(e:any) => setNewSlide({...newSlide, subtitle: e.target.value})} 
                        className={`w-full bg-transparent border-b-2 p-2 font-bold outline-none text-sm resize-none transition-all ${editingId ? 'border-blue-100 text-slate-900 focus:border-blue-600' : 'border-slate-800 text-white focus:border-blue-500'}`} 
                        rows={2} 
                    />
                </div>

                <div className="flex items-center gap-6">
                    <div className="w-32">
                        <AdminInput 
                            label="Display Order" 
                            type="number"
                            value={newSlide.order} 
                            onChange={(e:any) => setNewSlide({...newSlide, order: parseInt(e.target.value)})} 
                            dark={!editingId}
                        />
                    </div>
                    <div className="flex-1 pt-4">
                        <button onClick={handleSubmit} disabled={loading} className={`w-full py-4 rounded-2xl font-black italic text-xs uppercase transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-blue-600 text-white hover:bg-slate-900' : 'bg-red-600 text-white hover:bg-white hover:text-red-600'}`}>
                            {loading ? <Loader2 className="animate-spin"/> : editingId ? "Update Slide Asset" : "Deploy Slide"}
                        </button>
                    </div>
                    {editingId && (
                        <button onClick={() => {setEditingId(null); setNewSlide({title:"", subtitle:"", image_url:"", order:0})}} className="mt-4 p-4 bg-white text-slate-400 rounded-2xl border border-slate-100 hover:text-red-500">
                            <X size={20}/>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <p className={`text-[10px] font-black uppercase tracking-widest ${editingId ? 'text-slate-400' : 'text-slate-500'}`}>Visual Content</p>
                <div className={`relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed flex items-center justify-center transition-all ${editingId ? 'border-blue-200 bg-white' : 'border-slate-800 bg-slate-900/50'}`}>
                    {newSlide.image_url ? (
                        <>
                            <img src={newSlide.image_url} className="w-full h-full object-cover shadow-2xl" alt="Preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <label className="cursor-pointer bg-white text-slate-900 px-6 py-2 rounded-xl font-black italic text-[10px] uppercase flex items-center gap-2">
                                    <Upload size={14} /> Change Image
                                    <input type="file" className="hidden" onChange={handleUpload} />
                                </label>
                            </div>
                        </>
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-3 group">
                            <div className="p-4 bg-slate-800 rounded-full text-slate-500 group-hover:text-blue-500 transition-colors">
                                <ImageIcon size={32} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-500 italic">Upload slide background</span>
                            <input type="file" className="hidden" onChange={handleUpload} />
                        </label>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-blue-600/90 flex flex-col items-center justify-center text-white">
                            <Loader2 className="animate-spin mb-2" />
                            <span className="text-[10px] font-black uppercase">Uploading Asset...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 2: SLIDE MANAGEMENT */}
      <div className="space-y-6">
        <SectionHeader icon={<LayoutPanelTop size={18}/>} title="Live Slider Sequence" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {slides.map(slide => (
            <div key={slide.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all relative">
                <div className="relative aspect-video overflow-hidden">
                    {slide.image_url ? (
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : <div className="w-full h-full bg-slate-100" />}
                    
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-lg font-black italic text-[10px]">
                        ORDER #{slide.order}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-6">
                    <h3 className="font-black uppercase italic text-slate-900 text-sm mb-1 tracking-tighter">{slide.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">{slide.subtitle}</p>
                </div>

                <div className="absolute top-4 right-4 flex gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button onClick={() => startEdit(slide)} className="bg-white text-blue-600 p-3 rounded-xl shadow-xl hover:bg-blue-600 hover:text-white transition-all">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteSlide(slide.id)} className="bg-white text-red-600 p-3 rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

// --- Internal UI Components ---
const SectionHeader = ({ icon, title, dark = false }: any) => (
  <div className={`flex items-center gap-3 border-l-4 pl-4 ${dark ? 'border-red-600' : 'border-blue-600'}`}>
    <div className={dark ? 'text-red-600' : 'text-blue-600'}>{icon}</div>
    <h2 className={`text-sm font-black uppercase italic tracking-widest ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
  </div>
);

const AdminInput = ({ label, dark = false, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
    <input {...props} className={`w-full border-b-2 py-3 font-bold outline-none transition-all bg-transparent ${dark ? 'border-slate-800 text-white focus:border-red-500' : 'border-slate-100 text-slate-900 focus:border-blue-600'}`} />
  </div>
);