"use client";
import { useState, useEffect } from "react";
import { Save, Upload, Globe, Link as LinkIcon, Facebook, Twitter, Instagram, Youtube, Loader2 } from "lucide-react";

export default function FooterAdmin() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState<any>({
    site_title: "",
    logo_url: "",
    slogan: "",
    sub_slogan: "",
    facebook: "",
    twitter: "", // Added Twitter
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    fetch("http://localhost:8000/admin/footer")
      .then((res) => res.json())
      .then((data) => {
        // 🔹 Replace nulls with empty strings
        const cleanedData = {
          site_title: data.site_title || "",
          logo_url: data.logo_url || "",
          slogan: data.slogan || "",
          sub_slogan: data.sub_slogan || "",
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          instagram: data.instagram || "",
          youtube: data.youtube || "",
        };
        setSettings(cleanedData);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    
    // Optimistic Update: Show image locally before upload finishes
    const localPreview = URL.createObjectURL(file);
    setSettings({ ...settings, logo_url: localPreview });

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/admin/footer/upload-logo", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      // Final Update: Use the actual URL from backend
      setSettings({ ...settings, logo_url: data.logo_url });
      alert("Logo uploaded successfully!");
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) alert("Settings Saved!");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center animate-pulse italic font-black">Loading Settings...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Footer Management</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Branding & Social Presence</p>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black italic flex items-center gap-2 hover:bg-slate-900 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} SAVE CHANGES
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Branding Column */}
        <div className="space-y-8">
          <SectionHeader icon={<Globe size={18}/>} title="Branding" />
          
          <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Website Logo</p>
            <div className="flex items-center gap-6">
              {settings.logo_url ? (
                <div className="relative group">
                   <img 
                    src={settings.logo_url} 
                    className="h-20 w-32 object-contain bg-white p-2 rounded-xl shadow-sm border border-slate-200" 
                    alt="Logo Preview" 
                  />
                </div>
              ) : (
                <div className="h-20 w-32 bg-slate-200 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase italic">No Logo</div>
              )}
              
              <label className="flex-1 cursor-pointer group">
                <div className="flex flex-col items-center justify-center py-5 border-2 border-white rounded-xl group-hover:bg-white transition-all shadow-sm">
                  <Upload size={20} className="text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold uppercase italic">Replace Image</span>
                </div>
                <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </label>
            </div>
          </div>

          <AdminInput 
            label="Site Title" 
            value={settings.site_title} 
            onChange={(e:any) => setSettings({...settings, site_title: e.target.value})} 
          />
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Main Slogan</label>
            <textarea 
              value={settings.slogan} 
              onChange={(e:any) => setSettings({...settings, slogan: e.target.value})} 
              rows={3} 
              className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all resize-none" 
            />
          </div>
        </div>

        {/* Social Links Column */}
        <div className="space-y-6">
          <SectionHeader icon={<LinkIcon size={18}/>} title="Social Media Links" />
          <SocialInput 
            icon={<Facebook className="text-blue-600" />} 
            label="Facebook" 
            value={settings.facebook} 
            onChange={(e:any) => setSettings({...settings, facebook: e.target.value})} 
          />
          <SocialInput 
            icon={<Twitter className="text-sky-400" />} // Added Twitter input
            label="Twitter / X" 
            value={settings.twitter} 
            onChange={(e:any) => setSettings({...settings, twitter: e.target.value})} 
          />
          <SocialInput 
            icon={<Instagram className="text-pink-600" />} 
            label="Instagram" 
            value={settings.instagram} 
            onChange={(e:any) => setSettings({...settings, instagram: e.target.value})} 
          />
          <SocialInput 
            icon={<Youtube className="text-red-600" />} 
            label="YouTube" 
            value={settings.youtube} 
            onChange={(e:any) => setSettings({...settings, youtube: e.target.value})} 
          />
        </div>
      </div>
    </div>
  );
}

// --- Sub-components remain the same ---
const SectionHeader = ({ icon, title }: any) => (
  <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
    <div className="text-blue-600">{icon}</div>
    <h2 className="text-sm font-black uppercase italic tracking-widest text-slate-900">{title}</h2>
  </div>
);

const AdminInput = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <input {...props} className="w-full border-b-2 border-slate-100 py-3 font-bold outline-none focus:border-blue-600 transition-all" />
  </div>
);

const SocialInput = ({ icon, label, ...props }: any) => (
  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-transparent focus-within:border-blue-100 transition-all">
    <div className="bg-white p-2 rounded-xl shadow-sm">{icon}</div>
    <div className="flex-1">
       <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-tighter">{label}</p>
       <input {...props} placeholder="https://..." className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 placeholder:text-slate-300" />
    </div>
  </div>
);