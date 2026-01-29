"use client";
import { useState, useEffect } from "react";
import { 
  Save, Upload, MapPin, Layout, Phone, 
  Mail, ListPlus, Trash2, Loader2, Info, Globe, Edit2, X 
} from "lucide-react";

export default function AdminContactPage() {
  // Data States
  const [fields, setFields] = useState<any[]>([]);
  const [info, setInfo] = useState({ 
    address: "", phone: "", email: "", latitude: 0, longitude: 0 
  });
  const [metaData, setMetaData] = useState({
    header_title: "", header_description: "", header_image: "",
    page_title: "", page_subtitle: ""
  });

  // UI States
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newField, setNewField] = useState({ label: "", field_type: "text" });
  
  // Edit States for Form Builder
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editField, setEditField] = useState({ label: "", field_type: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const [iRes, mRes, fRes] = await Promise.all([
            fetch(`${apiUrl}/admin/contact/info`),
            fetch(`${apiUrl}/admin/meta/contact`),
            fetch(`${apiUrl}/admin/contact/fields`)
        ]);
        if (iRes.ok) setInfo(await iRes.json());
        if (mRes.ok) setMetaData(await mRes.json());
        if (fRes.ok) setFields(await fRes.json());
    } finally {
        setFetching(false);
    }
  };

  // --- Handlers ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (!file) return;
    setLoading(true);
    const data = new FormData(); 
    data.append("file", file); // 🔹 Key must be "file"
    try {
      const res = await fetch(`${apiUrl}/admin/about/upload-image`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` }, 
        body: data,
      });
      const result = await res.json();
      setMetaData({ ...metaData, header_image: result.url });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
        await Promise.all([
            fetch(`${apiUrl}/admin/meta/contact`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(metaData),
            }),
            fetch(`${apiUrl}/admin/contact/info`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(info)
            })
        ]);
        alert("Settings Saved Successfully!");
    } finally {
        setLoading(false);
    }
  };

  // --- Form Field CRUD ---

  const handleAddField = async () => {
    if (!newField.label) return alert("Label is required");
    await fetch(`${apiUrl}/admin/contact/fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newField)
    });
    setNewField({ label: "", field_type: "text" });
    fetchData();
  };

const handleUpdateField = async (id: number) => {
  setLoading(true);
  try {
    const res = await fetch(`${apiUrl}/admin/contact/fields/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(editField)
    });
    if (res.ok) {
      setEditingId(null);
      fetchData();
    }
  } finally {
    setLoading(false);
  }
};

  const handleDeleteField = async (id: number) => {
    if (!confirm("Delete this field?")) return;
    await fetch(`${apiUrl}/admin/contact/fields/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    fetchData();
  };

  if (fetching) return <div className="p-10 text-center animate-pulse italic font-black">Loading Contact Data...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 space-y-12 mb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Contact Management</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page Meta & Inquiry Form Builder</p>
        </div>
        <button 
          onClick={handleSaveAll} 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black italic flex items-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} SAVE CHANGES
        </button>
      </div>

      {/* SECTION 1: BANNER & TITLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <SectionHeader icon={<Layout size={18}/>} title="Header & Titles" />
          <AdminInput label="Banner Title" value={metaData.header_title} onChange={(e:any) => setMetaData({...metaData, header_title: e.target.value})} />
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Banner Description</label>
            <textarea 
              value={metaData.header_description} 
              onChange={(e:any) => setMetaData({...metaData, header_description: e.target.value})} 
              rows={2} 
              className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all resize-none shadow-sm" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Section Title" value={metaData.page_title} onChange={(e:any) => setMetaData({...metaData, page_title: e.target.value})} />
            <AdminInput label="Section Subtitle" value={metaData.page_subtitle} onChange={(e:any) => setMetaData({...metaData, page_subtitle: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Banner Image</p>
          <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-6 bg-slate-50/50 flex flex-col items-center group hover:border-blue-200 transition-all">
            {metaData.header_image ? (
              <img src={metaData.header_image} className="h-44 w-full object-cover rounded-2xl shadow-sm border border-white mb-4" alt="Banner" />
            ) : (
              <div className="h-44 w-full bg-white rounded-2xl flex items-center justify-center text-[10px] font-bold text-slate-300 italic uppercase">No Image</div>
            )}
            <label className="w-full cursor-pointer">
                <div className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all font-black italic text-xs uppercase">
                    <Upload size={16} /> Update Image
                </div>
                <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 2: INFO & MAP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <SectionHeader icon={<Phone size={18}/>} title="Direct Contact" />
          <AdminInput label="Address" value={info.address} onChange={(e:any) => setInfo({...info, address: e.target.value})} />
          <AdminInput label="Phone" value={info.phone} onChange={(e:any) => setInfo({...info, phone: e.target.value})} />
          <AdminInput label="Email" value={info.email} onChange={(e:any) => setInfo({...info, email: e.target.value})} />
        </div>

        <div className="space-y-6">
          <SectionHeader icon={<Globe size={18}/>} title="Map Coordinates" />
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <AdminInput 
                  type="number" 
                  step="any" 
                  label="Latitude" 
                  value={isNaN(info.latitude) ? "" : info.latitude} 
                  onChange={(e:any) => setInfo({...info, latitude: e.target.value === "" ? NaN : parseFloat(e.target.value)})} 
                />
                <AdminInput 
                  type="number" 
                  step="any" 
                  label="Longitude" 
                  value={isNaN(info.longitude) ? "" : info.longitude} 
                  onChange={(e:any) => setInfo({...info, longitude: e.target.value === "" ? NaN : parseFloat(e.target.value)})} 
                />
             </div>
             <p className="text-[9px] font-black uppercase text-slate-400 italic">Verify coordinates on Google Maps</p>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 3: FORM BUILDER WITH EDIT */}
      <div className="space-y-8">
        <SectionHeader icon={<ListPlus size={18}/>} title="Inquiry Form Builder" />
        
        {/* New Field Bar */}
        <div className="bg-slate-950 p-8 rounded-[2rem] flex flex-col md:flex-row items-end gap-6 shadow-xl shadow-slate-900/20">
          <div className="flex-1">
             <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Label Name</label>
             <input 
               placeholder="e.g. License Status" 
               value={newField.label} 
               onChange={e => setNewField({...newField, label: e.target.value})} 
               className="w-full bg-slate-900 border-b-2 border-slate-800 text-white py-2 outline-none focus:border-blue-500 font-bold"
             />
          </div>
          <div className="w-full md:w-48">
             <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Input Type</label>
             <select 
               value={newField.field_type} 
               onChange={e => setNewField({...newField, field_type: e.target.value})} 
               className="w-full bg-slate-900 text-white py-2 font-bold outline-none cursor-pointer"
             >
                <option value="text">Standard Text</option>
                <option value="email">Email Address</option>
                <option value="tel">Phone Number</option>
                <option value="textarea">Large Message</option>
             </select>
          </div>
          <button onClick={handleAddField} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black italic hover:bg-white hover:text-blue-600 transition-all uppercase text-xs">
            Add Field
          </button>
        </div>

        {/* Existing Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(f => (
            <div 
                key={f.id} 
                className={`p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                    editingId === f.id ? 'border-blue-600 bg-blue-50/50 shadow-inner' : 'bg-white border-slate-100 shadow-sm'
                }`}
            >
              {editingId === f.id ? (
                /* INLINE EDIT MODE */
                <div className="flex flex-1 gap-4 items-center">
                  <input 
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-600"
                    value={editField.label}
                    onChange={e => setEditField({...editField, label: e.target.value})}
                  />
                  <select 
                    className="bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold outline-none"
                    value={editField.field_type}
                    onChange={e => setEditField({...editField, field_type: e.target.value})}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="textarea">Message</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleUpdateField(f.id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><Save size={14}/></button>
                    <button onClick={() => setEditingId(null)} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"><X size={14}/></button>
                  </div>
                </div>
              ) : (
                /* VIEW MODE */
                <>
                  <div>
                    <p className="font-black uppercase italic text-xs text-slate-900 tracking-tighter">{f.label}</p>
                    <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">{f.field_type}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => {
                            setEditingId(f.id);
                            setEditField({ label: f.label, field_type: f.field_type });
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => handleDeleteField(f.id)} 
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Internal UI Components ---
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