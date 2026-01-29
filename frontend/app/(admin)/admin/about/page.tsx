"use client";
import { useState, useEffect } from "react";
import { 
  Save, Upload, User, Layout, 
  Loader2, Image as ImageIcon, FileText,
  CheckCircle, ArrowUpRight
} from "lucide-react";

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [metaData, setMetaData] = useState({
    header_title: "", header_description: "", header_image: "",
    page_title: "", page_subtitle: ""
  });

  const [contentData, setContentData] = useState({
    description: "",
    hero_image: ""
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mRes, cRes] = await Promise.all([
        fetch(`${apiUrl}/admin/meta/about`),
        fetch(`${apiUrl}/admin/about`)
      ]);
      if (mRes.ok) setMetaData(await mRes.json());
      if (cRes.ok) {
        const content = await cRes.json();
        setContentData({
          description: content.description || "",
          hero_image: content.hero_image || ""
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'header' | 'hero') => {
    const file = e.target.files?.[0]; 
    if (!file) return;
  
    setUploading(true);
    const data = new FormData(); 
    data.append("file", file); // Ensure key matches backend (usually "file")
    
    try {
      const res = await fetch(`${apiUrl}/admin/about/upload-image`, {
        method: "POST", 
        headers: { 
          Authorization: `Bearer ${token}` 
          // Note: Do NOT set Content-Type header when sending FormData
        }, 
        body: data,
      });
  
      if (!res.ok) throw new Error("Upload failed");
  
      const result = await res.json();
      // The 'result.url' comes back from your Cloudinary util
      if (target === 'header') {
        setMetaData({ ...metaData, header_image: result.url });
      } else {
        setContentData({ ...contentData, hero_image: result.url });
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch(`${apiUrl}/admin/meta/about`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(metaData),
        }),
        fetch(`${apiUrl}/admin/about`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(contentData),
        })
      ]);
      alert("About Page Successfully Updated!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse italic font-black">Syncing Biography...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 space-y-12 mb-20">
      
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">About Discovery</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand Story & Page Configuration</p>
        </div>
        <button 
          onClick={handleSaveAll} 
          disabled={saving || uploading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black italic flex items-center gap-2 hover:bg-slate-900 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
          {saving ? "Saving..." : "SAVE CHANGES"}
        </button>
      </div>

      {/* SECTION 1: GLOBAL PAGE META */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <SectionHeader icon={<Layout size={18}/>} title="Header & Banner Titles" />
          <AdminInput label="Banner Title" value={metaData.header_title} onChange={(e:any) => setMetaData({...metaData, header_title: e.target.value})} />
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Banner Sub-Description</label>
            <textarea 
              value={metaData.header_description} 
              onChange={(e:any) => setMetaData({...metaData, header_description: e.target.value})} 
              rows={2} 
              className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all resize-none shadow-sm text-sm" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Inner Title" value={metaData.page_title} onChange={(e:any) => setMetaData({...metaData, page_title: e.target.value})} />
            <AdminInput label="Inner Subtitle" value={metaData.page_subtitle} onChange={(e:any) => setMetaData({...metaData, page_subtitle: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Header Background</p>
          <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-6 bg-slate-50/50 flex flex-col items-center group relative overflow-hidden">
            {metaData.header_image ? (
              <img src={metaData.header_image} className="h-44 w-full object-cover rounded-3xl mb-4 shadow-md transition-transform group-hover:scale-[1.02]" alt="Banner" />
            ) : <div className="h-44 w-full bg-white rounded-3xl mb-4 flex items-center justify-center text-slate-300 font-bold italic text-xs uppercase">No Image Set</div>}
            
            <label className="w-full cursor-pointer">
              <div className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all font-black italic text-[10px] uppercase">
                  <Upload size={14} /> {uploading ? "Uploading..." : "Replace Banner Image"}
              </div>
              <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'header')} />
            </label>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 2: MAIN BIOGRAPHY CONTENT */}
      <div className="space-y-8">
        <SectionHeader icon={<FileText size={18}/>} title="The Brand Story" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Story Text Area */}
          <div className="lg:col-span-2 space-y-4">
             <div className="bg-slate-950 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                   <ArrowUpRight className="text-blue-500" size={16} />
                   <h4 className="text-[10px] font-black uppercase italic text-slate-500 tracking-widest">Main Biography Text</h4>
                </div>
                <textarea 
                  value={contentData.description} 
                  onChange={e => setContentData({...contentData, description: e.target.value})} 
                  className="w-full bg-transparent text-slate-200 font-bold text-base leading-relaxed outline-none min-h-[350px] resize-none placeholder:text-slate-800" 
                  placeholder="Draft your brand history and mission here..."
                />
             </div>
          </div>

          {/* Feature Image Area */}
          <div className="space-y-6">
             <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} className="text-blue-600" /> Feature Hero Image
                </p>
                <div className="aspect-[3/4] w-full bg-slate-50 rounded-3xl overflow-hidden border-4 border-white shadow-inner relative group">
                    {contentData.hero_image ? (
                        <img src={contentData.hero_image} className="w-full h-full object-cover" alt="Hero" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300 italic text-[10px] font-black">No Hero Asset</div>
                    )}
                    <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-sm">
                        <div className="bg-white text-slate-900 px-6 py-2 rounded-xl font-black italic text-[10px] uppercase flex items-center gap-2">
                            <Upload size={14} /> Change Hero
                        </div>
                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'hero')} />
                    </label>
                </div>
                <p className="text-[9px] font-bold text-slate-400 leading-tight italic px-2">
                    * This image appears alongside your biography text in the main section.
                </p>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// --- Shared Internal UI Components ---
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