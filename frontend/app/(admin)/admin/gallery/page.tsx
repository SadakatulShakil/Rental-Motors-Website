"use client";
import { useState, useEffect } from "react";
import { 
  Save, Upload, Image as ImageIcon, Layout, 
  Trash2, Loader2, Plus, Camera, X 
} from "lucide-react";

export default function AdminGalleryPage() {
  // Data States
  const [images, setImages] = useState<any[]>([]);
  const [metaData, setMetaData] = useState({
    header_title: "", header_description: "", header_image: "",
    page_title: "", page_subtitle: ""
  });

  // UI States
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newImage, setNewImage] = useState<{file: File | null, desc: string}>({ file: null, desc: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const [imgRes, metaRes] = await Promise.all([
            fetch(`${apiUrl}/admin/gallery/`),
            fetch(`${apiUrl}/admin/meta/gallery`)
        ]);
        if (imgRes.ok) setImages(await imgRes.json());
        if (metaRes.ok) setMetaData(await metaRes.json());
    } finally {
        setFetching(false);
    }
  };

  // --- Handlers ---

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (!file) return;
    setLoading(true);
    
    const data = new FormData(); 
    data.append("file", file);
  
    try {
      const res = await fetch(`${apiUrl}/admin/about/upload-image`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` }, 
        body: data,
      });
      const result = await res.json();
      setMetaData({ ...metaData, header_image: result.url });
      
      // 🔔 Notification added here
      alert("✅ Banner Image Uploaded! Click 'SAVE CHANGES' at the top to finalize the text and layout.");
      
    } catch (err) {
      alert("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadGalleryItem = async () => {
    if (!newImage.file) return alert("Select an image first");
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", newImage.file);
    if (newImage.desc) formData.append("description", newImage.desc);
  
    try {
      const res = await fetch(`${apiUrl}/admin/gallery/upload`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
  
      if (res.ok) {
        // 🔔 Notification added here
        alert("✅ Photo Published to Live Gallery!");
        setNewImage({ file: null, desc: "" });
        fetchData();
      } else {
        const error = await res.json();
        alert(`Upload Error: ${error.detail}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Critical error during upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeta = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/admin/meta/gallery`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(metaData),
      });
      if (res.ok) {
        alert("🎉 Gallery Header & Settings Updated Successfully!");
      }
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Permanently remove this photo?")) return;
    const res = await fetch(`${apiUrl}/admin/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      alert("🗑️ Photo removed from gallery.");
      fetchData();
    }
  };

  if (fetching) return <div className="p-10 text-center animate-pulse italic font-black text-slate-900 uppercase">Synchronizing Gallery...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 space-y-12 mb-20">
      
      {/* Header Section */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Gallery Management</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portfolio & Header Configuration</p>
        </div>
        <button 
          onClick={handleSaveMeta} 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black italic flex items-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/10"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} SAVE CHANGES
        </button>
      </div>

      {/* SECTION 1: GALLERY TITLES & BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <SectionHeader icon={<Layout size={18}/>} title="Global Page Titles" />
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
            <AdminInput label="Body Title" value={metaData.page_title} onChange={(e:any) => setMetaData({...metaData, page_title: e.target.value})} />
            <AdminInput label="Body Subtitle" value={metaData.page_subtitle} onChange={(e:any) => setMetaData({...metaData, page_subtitle: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gallery Header Image</p>
          <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-6 bg-slate-50/50 flex flex-col items-center group hover:border-blue-200 transition-all">
            {metaData.header_image ? (
              <img src={metaData.header_image} className="h-52 w-full object-cover rounded-3xl shadow-md border-4 border-white mb-4" alt="Banner" />
            ) : (
              <div className="h-52 w-full bg-white rounded-3xl flex items-center justify-center text-[10px] font-bold text-slate-300 italic uppercase">No Image Set</div>
            )}
            <label className="w-full cursor-pointer">
                <div className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-slate-950 group-hover:text-white transition-all font-black italic text-xs uppercase">
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={16} />} Replace Banner
                </div>
                <input type="file" className="hidden" onChange={handleBannerUpload} />
            </label>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 2: DARK UPLOAD BAR */}
      <div className="space-y-8">
        <SectionHeader icon={<Camera size={18}/>} title="Add New Media" />
        
        <div className="bg-slate-950 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-slate-900/20">
          <div className="w-full md:w-64">
             <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Select File</label>
             <label className="cursor-pointer group">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-center gap-2 group-hover:bg-slate-800 transition-all overflow-hidden">
                    <Plus size={16} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 truncate">
                        {newImage.file ? newImage.file.name : "Choose Image"}
                    </span>
                </div>
                <input type="file" className="hidden" onChange={e => setNewImage({...newImage, file: e.target.files?.[0] || null})} />
             </label>
          </div>
          
          <div className="flex-1 w-full">
             <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Photo Caption / Description</label>
             <input 
               placeholder="e.g. 2024 Ducati Panigale v4 Review" 
               value={newImage.desc} 
               onChange={e => setNewImage({...newImage, desc: e.target.value})} 
               className="w-full bg-slate-900 border-b-2 border-slate-800 text-white py-2 outline-none focus:border-blue-500 font-bold placeholder:text-slate-700"
             />
          </div>

          <button 
            onClick={handleUploadGalleryItem} 
            disabled={loading || !newImage.file}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black italic hover:bg-white hover:text-blue-600 transition-all uppercase text-xs"
          >
            {loading ? "Uploading..." : "Publish Photo"}
          </button>
        </div>
      </div>

      {/* SECTION 3: MASONRY-STYLE GRID */}
      <div className="space-y-6">
        <SectionHeader icon={<ImageIcon size={18}/>} title="Live Gallery Feed" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(img => (
            <div key={img.id} className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <img src={img.image} className="h-48 w-full object-cover" alt="Gallery" />
              
              {/* Overlay Overlay */}
              <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                <button 
                  onClick={() => handleDelete(img.id)} 
                  className="bg-white text-red-600 px-6 py-2 rounded-xl font-black italic text-xs uppercase shadow-lg hover:bg-red-600 hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>

              {img.description && (
                <div className="p-4 bg-white border-t border-slate-50">
                   <p className="text-[10px] font-black italic uppercase text-slate-900 truncate tracking-tight">{img.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
    <input {...props} className="w-full border-b-2 border-slate-100 py-3 font-bold outline-none focus:border-blue-600 transition-all text-slate-900 bg-transparent text-sm" />
  </div>
);