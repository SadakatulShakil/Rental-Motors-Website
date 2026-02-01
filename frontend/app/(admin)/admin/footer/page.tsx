"use client";
import { useState, useEffect } from "react";
import { Save, Upload, Globe, Link as LinkIcon, Facebook, Twitter, Instagram, Youtube, Loader2, Type } from "lucide-react";

export default function FooterAdmin() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState<any>({
    site_title: "",
    logo_url: "",
    slogan: "",
    sub_slogan: "", // 🔹 Included
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    fetch(`${apiUrl}/admin/footer`)
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          site_title: data.site_title || "",
          logo_url: data.logo_url || "",
          slogan: data.slogan || "",
          sub_slogan: data.sub_slogan || "", // 🔹 Included
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          instagram: data.instagram || "",
          youtube: data.youtube || "",
        });
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [apiUrl]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
  
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/admin/footer/upload-logo`, {
        method: "PUT",
        headers: {
          // the browser does it automatically with the boundary.
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}` 
        },
        body: formData,
      });
  
      if (!res.ok) throw new Error("Upload failed");
  
      const data = await res.json();
      
      // This triggers the re-render so the logo shows up in the preview box
      setSettings((prev: any) => ({ 
        ...prev, 
        logo_url: data.logo_url 
      }));
  
      alert("✅ Logo uploaded! Preview updated. Now click 'SAVE CHANGES' to finish.");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/admin/footer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) alert("🎉 Footer Settings Synchronized!");
    } catch (err) {
      alert("❌ Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center animate-pulse italic font-black text-slate-900">Configuring Footer...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 space-y-10 mb-10">
      
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Footer Admin</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity & Global Navigation</p>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black italic flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-blue-600/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} SAVE CHANGES
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Branding Column */}
        <div className="space-y-8">
          <SectionHeader icon={<Globe size={18}/>} title="Brand Assets" />
          
          <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50 flex flex-col items-center">
             <div className="mb-4">
                {settings.logo_url ? (
                    <img src={settings.logo_url} className="h-20 w-auto object-contain bg-white p-2 rounded-xl shadow-sm border border-slate-200" alt="Logo" />
                ) : (
                    <div className="h-20 w-32 bg-slate-200 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase italic">Empty Logo</div>
                )}
             </div>
              <label className="w-full cursor-pointer group">
                <div className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-xl font-black italic text-[10px] uppercase shadow-sm group-hover:bg-slate-950 group-hover:text-white transition-all">
                  <Upload size={16} /> {loading ? "Uploading..." : "Replace Logo Image"}
                </div>
                <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </label>
          </div>

          <AdminInput 
            label="Site Title" 
            value={settings.site_title} 
            onChange={(e:any) => setSettings({...settings, site_title: e.target.value})} 
          />
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Main Slogan</label>
                <textarea 
                value={settings.slogan} 
                onChange={(e:any) => setSettings({...settings, slogan: e.target.value})} 
                rows={2} 
                className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all text-sm" 
                />
            </div>

            {/* 🔹 SUB SLOGAN ADDED HERE */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sub Slogan / Legal Text</label>
                <textarea 
                value={settings.sub_slogan} 
                onChange={(e:any) => setSettings({...settings, sub_slogan: e.target.value})} 
                rows={2} 
                className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all text-sm" 
                placeholder="e.g. Authorized Dealer & Rental Service"
                />
            </div>
          </div>
        </div>

        {/* Social Links Column */}
        <div className="space-y-6">
          <SectionHeader icon={<LinkIcon size={18}/>} title="Connect Profiles" />
          <SocialInput icon={<Facebook className="text-blue-600" />} label="Facebook" value={settings.facebook} onChange={(e:any) => setSettings({...settings, facebook: e.target.value})} />
          <SocialInput icon={<Twitter className="text-sky-400" />} label="Twitter / X" value={settings.twitter} onChange={(e:any) => setSettings({...settings, twitter: e.target.value})} />
          <SocialInput icon={<Instagram className="text-pink-600" />} label="Instagram" value={settings.instagram} onChange={(e:any) => setSettings({...settings, instagram: e.target.value})} />
          <SocialInput icon={<Youtube className="text-red-600" />} label="YouTube" value={settings.youtube} onChange={(e:any) => setSettings({...settings, youtube: e.target.value})} />
        </div>
      </div>
    </div>
  );
}

// Sub-components...
const SectionHeader = ({ icon, title }: any) => (
  <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
    <div className="text-blue-600">{icon}</div>
    <h2 className="text-sm font-black uppercase italic tracking-widest text-slate-900">{title}</h2>
  </div>
);

const AdminInput = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <input {...props} className="w-full border-b-2 border-slate-100 py-3 font-bold outline-none focus:border-blue-600 transition-all text-sm" />
  </div>
);

const SocialInput = ({ icon, label, ...props }: any) => (
  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 focus-within:border-blue-200 transition-all">
    <div className="bg-white p-2 rounded-xl shadow-sm">{icon}</div>
    <div className="flex-1">
       <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-tighter">{label}</p>
       <input {...props} placeholder="https://..." className="w-full bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 placeholder:text-slate-300" />
    </div>
  </div>
);