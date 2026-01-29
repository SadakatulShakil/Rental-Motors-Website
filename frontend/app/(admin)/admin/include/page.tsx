"use client"
import { useState, useEffect } from "react"
import { 
  Save, Upload, ShieldCheck, Layout, Trash2, 
  Loader2, Plus, Edit2, X, Info, 
  CheckCircle2, AlertCircle, Palette 
} from "lucide-react"

export default function AdminIncludedPage() {
  const [features, setFeatures] = useState([])
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  const [metaData, setMetaData] = useState({
    header_title: "", header_description: "", header_image: "",
    page_title: "", page_subtitle: ""
  })

  const [newFeat, setNewFeat] = useState({ icon_name: "FaMotorcycle", title: "", subtitle: "" })
  const [newPolicy, setNewPolicy] = useState({ title: "", points: "", color_type: "orange" })
  const [editFeatId, setEditFeatId] = useState<number | null>(null)
  const [editPolicyId, setEditPolicyId] = useState<number | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [fRes, pRes, mRes] = await Promise.all([
        fetch(`${apiUrl}/admin/include/features`),
        fetch(`${apiUrl}/admin/include/policies`),
        fetch(`${apiUrl}/admin/meta/include`)
      ])
      if (fRes.ok) setFeatures(await fRes.json())
      if (pRes.ok) setPolicies(await pRes.json())
      if (mRes.ok) setMetaData(await mRes.json())
    } finally {
      setFetching(false)
    }
  }

  // --- FEATURE ACTIONS ---
  const handleSaveFeature = async () => {
    if (!newFeat.title) return alert("Title is required");
    setLoading(true);
    try {
      const method = editFeatId ? "PUT" : "POST";
      const url = editFeatId 
        ? `${apiUrl}/admin/include/features/${editFeatId}`
        : `${apiUrl}/admin/include/features`;
  
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(newFeat)
      });
      
      if (res.ok) {
        setNewFeat({ icon_name: "FaMotorcycle", title: "", subtitle: "" });
        setEditFeatId(null);
        fetchData();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.detail || "Failed to save"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const startEditFeature = (f: any) => {
    setEditFeatId(f.id)
    setNewFeat({ icon_name: f.icon_name, title: f.title, subtitle: f.subtitle })
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleDeleteFeature = async (id: number) => {
    if (!confirm("Delete this feature?")) return
    await fetch(`${apiUrl}/admin/include/features/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
  }

  // --- POLICY ACTIONS (Now Included) ---
  const handleSavePolicy = async () => {
    if (!newPolicy.title || !newPolicy.points) return alert("Fill all policy fields")
    setLoading(true)
    const method = editPolicyId ? "PUT" : "POST"
    const url = editPolicyId 
      ? `${apiUrl}/admin/include/policies/${editPolicyId}`
      : `${apiUrl}/admin/include/policies`

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newPolicy)
    })
    if (res.ok) {
      setNewPolicy({ title: "", points: "", color_type: "orange" })
      setEditPolicyId(null)
      fetchData()
    }
    setLoading(false)
  }

  const startEditPolicy = (p: any) => {
    setEditPolicyId(p.id)
    setNewPolicy({ title: p.title, points: p.points, color_type: p.color_type })
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleDeletePolicy = async (id: number) => {
    if (!confirm("Delete this policy card?")) return
    await fetch(`${apiUrl}/admin/include/policies/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
  }

  // --- META ACTIONS ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (!file) return;
    setUploading(true);
    
    const data = new FormData(); 
    data.append("file", file); // 🔹 MUST BE "file"
  
    try {
      const res = await fetch(`${apiUrl}/admin/about/upload-image`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` }, // 🛡️ Ensure token is sent
        body: data,
      });
      const result = await res.json();
      setMetaData({ ...metaData, header_image: result.url });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMeta = async () => {
    setLoading(true)
    await fetch(`${apiUrl}/admin/meta/include`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(metaData),
    })
    setLoading(false)
    alert("Header Updated!")
  }

  if (fetching) return <div className="p-10 text-center animate-pulse italic font-black text-slate-900">Configuring Requirements...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 space-y-12 mb-20">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Rental Inclusions</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage Features & Safety Policies</p>
        </div>
        <button 
          onClick={handleSaveMeta} 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black italic flex items-center gap-2 hover:bg-slate-900 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} SAVE CHANGES
        </button>
      </div>

      {/* SECTION 1: PAGE META */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <SectionHeader icon={<Layout size={18}/>} title="Header Configuration" />
          <AdminInput label="Banner Title" value={metaData.header_title} onChange={(e:any) => setMetaData({...metaData, header_title: e.target.value})} />
          <textarea 
            placeholder="Header Description" 
            value={metaData.header_description} 
            onChange={e => setMetaData({...metaData, header_description: e.target.value})} 
            className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all resize-none bg-slate-50/30 shadow-sm" 
            rows={2} 
          />
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Inner Title" value={metaData.page_title} onChange={(e:any) => setMetaData({...metaData, page_title: e.target.value})} />
            <AdminInput label="Inner Subtitle" value={metaData.page_subtitle} onChange={(e:any) => setMetaData({...metaData, page_subtitle: e.target.value})} />
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-6 bg-slate-50/50 flex flex-col items-center group relative overflow-hidden">
          {metaData.header_image ? (
            <img src={metaData.header_image} className="h-48 w-full object-cover rounded-3xl mb-4 shadow-md transition-transform group-hover:scale-[1.02]" alt="Banner" />
          ) : <div className="h-48 w-full bg-white rounded-3xl mb-4 flex items-center justify-center text-slate-300 font-bold italic text-xs uppercase">No Image Loaded</div>}
          <label className="w-full cursor-pointer">
            <div className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all font-black italic text-[10px] uppercase">
                <Upload size={14} /> {uploading ? "Uploading..." : "Replace Banner Image"}
            </div>
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 2: FEATURES & POLICIES BUILDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* FEATURES COLUMN */}
        <div className="space-y-6">
          <SectionHeader icon={<CheckCircle2 size={18}/>} title="Included Features" />
          
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all space-y-4 ${editFeatId ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-950 border-slate-900 shadow-xl shadow-slate-900/10'}`}>
            <h3 className={`text-xs font-black uppercase italic tracking-widest ${editFeatId ? 'text-blue-600' : 'text-slate-500'}`}>
               {editFeatId ? "Update Feature" : "Create New Feature"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase ml-2">Icon Name</label>
                    <input className={`bg-transparent border-b p-2 font-bold outline-none text-sm ${editFeatId ? 'border-blue-200 text-blue-900' : 'border-slate-800 text-white'}`} value={newFeat.icon_name} onChange={e => setNewFeat({...newFeat, icon_name: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase ml-2">Title</label>
                    <input className={`bg-transparent border-b p-2 font-bold outline-none text-sm ${editFeatId ? 'border-blue-200 text-blue-900' : 'border-slate-800 text-white'}`} value={newFeat.title} onChange={e => setNewFeat({...newFeat, title: e.target.value})} />
                </div>
            </div>
            <textarea placeholder="Subtitle/Details" className={`w-full bg-transparent border-b p-2 font-bold outline-none text-sm resize-none ${editFeatId ? 'border-blue-200 text-blue-900 placeholder:text-blue-300' : 'border-slate-800 text-white placeholder:text-slate-700'}`} value={newFeat.subtitle} onChange={e => setNewFeat({...newFeat, subtitle: e.target.value})} rows={1} />
            
            <div className="flex gap-2 pt-2">
                <button onClick={handleSaveFeature} className={`flex-1 py-3 rounded-xl font-black italic text-[10px] uppercase transition-all ${editFeatId ? 'bg-blue-600 text-white' : 'bg-red-600 text-white hover:bg-white hover:text-red-600'}`}>
                    {editFeatId ? "Save Changes" : "Add to List"}
                </button>
                {editFeatId && <button onClick={() => {setEditFeatId(null); setNewFeat({icon_name:"FaMotorcycle", title:"", subtitle:""})}} className="px-4 bg-slate-200 text-slate-600 rounded-xl"><X size={16}/></button>}
            </div>
          </div>

          <div className="space-y-3">
            {features.map((f: any) => (
              <div key={f.id} className="p-5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group hover:border-red-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] italic">{f.icon_name.slice(0, 3)}</div>
                  <div>
                    <p className="font-black uppercase italic text-xs text-slate-900">{f.title}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{f.subtitle}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditFeature(f)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14}/></button>
                  <button onClick={() => handleDeleteFeature(f.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POLICIES COLUMN */}
        <div className="space-y-6">
          <SectionHeader icon={<AlertCircle size={18}/>} title="Rental Policies" />
          
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all space-y-4 ${editPolicyId ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
            <h3 className="text-xs font-black uppercase italic tracking-widest text-slate-400">
               {editPolicyId ? "Modify Policy" : "New Policy Card"}
            </h3>
            <AdminInput label="Policy Category Name" value={newPolicy.title} onChange={(e:any) => setNewPolicy({...newPolicy, title: e.target.value})} />
            <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rules (Comma Separated)</label>
                <textarea className="w-full border-b-2 border-slate-100 p-2 font-bold outline-none focus:border-blue-600 transition-all text-sm h-20 resize-none" value={newPolicy.points} onChange={e => setNewPolicy({...newPolicy, points: e.target.value})} />
            </div>
            
            <div className="flex gap-4 p-3 bg-slate-50 rounded-xl">
               <label className="flex items-center gap-2 text-[10px] font-black uppercase cursor-pointer">
                  <input type="radio" checked={newPolicy.color_type === 'orange'} onChange={() => setNewPolicy({...newPolicy, color_type: 'orange'})} className="accent-orange-500" /> Orange
               </label>
               <label className="flex items-center gap-2 text-[10px] font-black uppercase cursor-pointer">
                  <input type="radio" checked={newPolicy.color_type === 'dark'} onChange={() => setNewPolicy({...newPolicy, color_type: 'dark'})} className="accent-slate-900" /> Dark
               </label>
            </div>

            <div className="flex gap-2 pt-2">
                <button onClick={handleSavePolicy} className={`flex-1 py-3 rounded-xl font-black italic text-[10px] uppercase transition-all shadow-lg shadow-blue-600/10 ${editPolicyId ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'}`}>
                    {editPolicyId ? "Save Changes" : "Create Policy Card"}
                </button>
                {editPolicyId && <button onClick={() => {setEditPolicyId(null); setNewPolicy({title:"", points:"", color_type:"orange"})}} className="px-4 bg-slate-200 text-slate-600 rounded-xl"><X size={16}/></button>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {policies.map((p: any) => (
              <div key={p.id} className={`p-6 rounded-[2rem] flex justify-between items-center text-white group shadow-lg ${p.color_type === 'orange' ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-gradient-to-br from-slate-800 to-slate-950'}`}>
                <div className="flex-1 overflow-hidden">
                  <p className="font-black uppercase italic tracking-tighter text-lg">{p.title}</p>
                  <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest truncate">{p.points}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button onClick={() => startEditPolicy(p)} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><Edit2 size={16}/></button>
                  <button onClick={() => handleDeletePolicy(p.id)} className="p-3 bg-white/10 hover:bg-red-500/50 rounded-xl transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

const SectionHeader = ({ icon, title }: any) => (
  <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
    <div className="text-blue-600">{icon}</div>
    <h2 className="text-sm font-black uppercase italic tracking-widest text-slate-900">{title}</h2>
  </div>
);

const AdminInput = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <input {...props} className="w-full border-b-2 border-slate-100 py-3 font-bold outline-none focus:border-blue-600 transition-all text-slate-900 bg-transparent" />
  </div>
);