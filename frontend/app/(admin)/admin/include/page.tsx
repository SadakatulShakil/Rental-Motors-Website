"use client"
import { useState, useEffect } from "react"
import { 
  Save, Upload, Layout, Trash2, Loader2, 
  Edit2, X, CheckCircle2, AlertCircle, Palette
} from "lucide-react"

const ICON_OPTIONS = [
  "FaMotorcycle", "FaShieldAlt", "FaGasPump", "FaTools", 
  "FaRoad", "FaMapMarkedAlt", "FaClock", "FaHeadset", "FaKey", "FaWallet"
];

export default function AdminIncludedPage() {
  const [features, setFeatures] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  const [metaData, setMetaData] = useState({
    header_title: "", 
    header_description: "", // 🔹 Added
    header_image: "",
    page_title: "", 
    page_subtitle: "" // 🔹 Added
  })

  const [newFeat, setNewFeat] = useState({ icon_name: "FaMotorcycle", title: "", subtitle: "" })
  const [newPolicy, setNewPolicy] = useState({ title: "", points: "", color_type: "orange" })
  const [editFeatId, setEditFeatId] = useState<number | null>(null)
  const [editPolicyId, setEditPolicyId] = useState<number | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => { fetchData() }, [])

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
    } finally { setFetching(false) }
  }

  const notify = (msg: string) => {
    alert(`✅ ${msg}`);
  }

  const handleSaveFeature = async () => {
    if (!newFeat.title) return alert("Title is required");
    setLoading(true);
    try {
      const isEdit = editFeatId !== null;
      const res = await fetch(`${apiUrl}/admin/include/features${isEdit ? `/${editFeatId}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newFeat)
      });
      if (res.ok) {
        notify(isEdit ? "Feature Updated" : "Feature Added");
        setNewFeat({ icon_name: "FaMotorcycle", title: "", subtitle: "" });
        setEditFeatId(null);
        fetchData();
      }
    } finally { setLoading(false); }
  }

  const handleSavePolicy = async () => {
    if (!newPolicy.title || !newPolicy.points) return alert("Fill all fields")
    setLoading(true)
    try {
        const isEdit = editPolicyId !== null;
        const res = await fetch(`${apiUrl}/admin/include/policies${isEdit ? `/${editPolicyId}` : ""}`, {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(newPolicy)
        })
        if (res.ok) {
          notify(isEdit ? "Policy Updated" : "Policy Created");
          setNewPolicy({ title: "", points: "", color_type: "orange" })
          setEditPolicyId(null)
          fetchData()
        }
    } finally { setLoading(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const data = new FormData(); data.append("file", file);
    try {
      const res = await fetch(`${apiUrl}/admin/about/upload-image`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await res.json();
      setMetaData({ ...metaData, header_image: result.url });
      notify("Image Uploaded Successfully");
    } finally { setUploading(false); }
  };

  const handleGlobalSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/admin/meta/include`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(metaData),
      });
      if (res.ok) alert("🎉 Page Header & Meta Saved Successfully!");
    } finally { setLoading(false); }
  }

  if (fetching) return <div className="p-10 text-center animate-pulse italic font-black text-slate-900">Syncing Rental Data...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 space-y-12 mb-20">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Inclusions Manager</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Page Config & Assets</p>
        </div>
        <button onClick={handleGlobalSave} disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black italic flex items-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} SAVE CHANGES
        </button>
      </div>

      {/* SECTION 1: META & TITLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <SectionHeader icon={<Layout size={18}/>} title="Banner & Descriptions" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <AdminInput label="Banner Main Title" value={metaData.header_title} onChange={(e:any) => setMetaData({...metaData, header_title: e.target.value})} />
             <AdminInput label="Banner Description" value={metaData.header_description} onChange={(e:any) => setMetaData({...metaData, header_description: e.target.value})} />
             <AdminInput label="Inner Section Title" value={metaData.page_title} onChange={(e:any) => setMetaData({...metaData, page_title: e.target.value})} />
             <AdminInput label="Inner Subtitle" value={metaData.page_subtitle} onChange={(e:any) => setMetaData({...metaData, page_subtitle: e.target.value})} />
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-6 bg-slate-50/50 flex flex-col items-center group relative overflow-hidden">
          {metaData.header_image ? (
            <img src={metaData.header_image} className="h-40 w-full object-cover rounded-3xl mb-4" alt="Banner" />
          ) : <div className="h-40 w-full bg-white rounded-3xl mb-4 flex items-center justify-center text-slate-300 italic uppercase text-[10px]">No Banner</div>}
          <label className="w-full cursor-pointer">
            <div className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all font-black italic text-[10px] uppercase">
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Banner"}
            </div>
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 2: BUILDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* FEATURES */}
        <div className="space-y-6">
          <SectionHeader icon={<CheckCircle2 size={18}/>} title="Feature Builder" />
          
          {/* 🔹 FEATURE EDITOR - Adjusted colors for edit mode */}
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all space-y-4 ${editFeatId ? 'bg-blue-50 border-blue-200' : 'bg-slate-950 border-slate-900 shadow-xl'}`}>
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${editFeatId ? 'text-blue-600' : 'text-slate-500'}`}>
                {editFeatId ? "Editing Mode Active" : "Create New Feature"}
            </p>
            <div className="grid grid-cols-5 gap-2 pb-4">
                {ICON_OPTIONS.map(icon => (
                    <button key={icon} onClick={() => setNewFeat({...newFeat, icon_name: icon})} className={`p-2 rounded-lg text-[9px] font-black transition-all ${newFeat.icon_name === icon ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white'}`}>
                        {icon.replace("Fa", "")}
                    </button>
                ))}
            </div>
            {/* 🔹 Text input colors change to black in edit mode for visibility */}
            <input placeholder="Feature Title" className={`w-full bg-transparent border-b p-2 font-bold outline-none focus:border-blue-500 ${editFeatId ? 'border-blue-200 text-slate-900' : 'border-slate-800 text-white'}`} value={newFeat.title} onChange={e => setNewFeat({...newFeat, title: e.target.value})} />
            <input placeholder="Subtitle" className={`w-full bg-transparent border-b p-2 font-bold outline-none focus:border-blue-500 ${editFeatId ? 'border-blue-200 text-slate-900' : 'border-slate-800 text-white'}`} value={newFeat.subtitle} onChange={e => setNewFeat({...newFeat, subtitle: e.target.value})} />
            <div className="flex gap-2 pt-2">
                <button onClick={handleSaveFeature} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black italic text-[10px] uppercase shadow-lg shadow-blue-600/20">
                    {editFeatId ? "Update Feature" : "Add Feature"}
                </button>
                {editFeatId && <button onClick={() => {setEditFeatId(null); setNewFeat({icon_name:"FaMotorcycle", title:"", subtitle:""})}} className="p-3 bg-white text-blue-600 border border-blue-200 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"><X size={16}/></button>}
            </div>
          </div>

          <div className="space-y-2">
            {features.map((f: any) => (
              <div key={f.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-blue-600 uppercase tracking-tighter">{f.icon_name.slice(2,5)}</div>
                    <div>
                        <p className="font-black text-xs uppercase italic text-slate-900">{f.title}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{f.subtitle}</p>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => {setEditFeatId(f.id); setNewFeat({...f});}} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14}/></button>
                  <button onClick={async () => { if(confirm("Delete?")) { await fetch(`${apiUrl}/admin/include/features/${f.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); fetchData(); } }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POLICIES */}
        <div className="space-y-6">
          <SectionHeader icon={<AlertCircle size={18}/>} title="Policy Builder" />
          
          <div className={`p-8 rounded-[2.5rem] border-2 space-y-4 ${editPolicyId ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
            <AdminInput label="Policy Category" value={newPolicy.title} onChange={(e:any) => setNewPolicy({...newPolicy, title: e.target.value})} />
            <textarea placeholder="Points (comma separated)" className="w-full border-b border-slate-100 p-2 font-bold outline-none focus:border-blue-600 text-sm h-16 resize-none bg-transparent" value={newPolicy.points} onChange={e => setNewPolicy({...newPolicy, points: e.target.value})} />
            
            {/* 🔹 COLOR SELECTION TOGGLE */}
            <div className="flex items-center justify-between py-2">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Palette size={12}/> Select Theme</span>
                <div className="flex gap-2">
                    <button onClick={() => setNewPolicy({...newPolicy, color_type: 'orange'})} className={`w-6 h-6 rounded-full bg-orange-500 border-2 ${newPolicy.color_type === 'orange' ? 'border-slate-900 scale-110' : 'border-transparent'}`} />
                    <button onClick={() => setNewPolicy({...newPolicy, color_type: 'dark'})} className={`w-6 h-6 rounded-full bg-slate-900 border-2 ${newPolicy.color_type === 'dark' ? 'border-blue-500 scale-110' : 'border-transparent'}`} />
                </div>
            </div>

            <div className="flex gap-2">
                <button onClick={handleSavePolicy} className="flex-1 bg-slate-950 text-white py-3 rounded-xl font-black italic text-[10px] uppercase shadow-lg shadow-slate-900/20">
                    {editPolicyId ? "Update Policy" : "Create Card"}
                </button>
                {editPolicyId && <button onClick={() => {setEditPolicyId(null); setNewPolicy({title:"", points:"", color_type:"orange"})}} className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"><X size={16}/></button>}
            </div>
          </div>

          <div className="space-y-3">
            {policies.map((p: any) => (
              <div key={p.id} className={`p-5 rounded-[1.5rem] flex justify-between items-center text-white shadow-lg transition-transform hover:scale-[1.01] ${p.color_type === 'orange' ? 'bg-orange-500 shadow-orange-500/10' : 'bg-slate-900 shadow-slate-900/10'}`}>
                <div className="truncate pr-4">
                    <p className="font-black uppercase italic text-sm tracking-tight">{p.title}</p>
                    <p className="text-[8px] font-bold opacity-80 truncate uppercase tracking-widest mt-0.5">{p.points}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => {setEditPolicyId(p.id); setNewPolicy({...p});}} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><Edit2 size={12}/></button>
                  <button onClick={async () => { if(confirm("Delete Policy?")) { await fetch(`${apiUrl}/admin/include/policies/${p.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); fetchData(); } }} className="p-2 bg-white/10 hover:bg-red-500/40 rounded-lg transition-colors"><Trash2 size={12}/></button>
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
    <input {...props} className="w-full border-b border-slate-100 py-3 font-bold outline-none focus:border-blue-600 transition-all text-slate-900 bg-transparent placeholder:text-slate-200" />
  </div>
);