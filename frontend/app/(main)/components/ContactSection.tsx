"use client"
import { useState, useEffect, useRef } from "react"
import { CheckCircle, Mail, Phone, MapPin, Loader2, SendHorizonal } from "lucide-react"

export default function ContactPage() {
  const [meta, setMeta] = useState<any>(null)
  const [info, setInfo] = useState<any>(null)
  const [fields, setFields] = useState<any[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [status, setStatus] = useState({ loading: false, message: "" })
  const [activeInfoIndex, setActiveInfoIndex] = useState(0)

  const infoScrollRef = useRef<HTMLDivElement>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, iRes, fRes] = await Promise.all([
          fetch(`${apiUrl}/admin/meta/contact`),
          fetch(`${apiUrl}/admin/contact/info`),
          fetch(`${apiUrl}/admin/contact/fields`)
        ])
        if (mRes.ok) setMeta(await mRes.json())
        if (iRes.ok) setInfo(await iRes.json())
        if (fRes.ok) {
          const fieldData = await fRes.json()
          setFields(fieldData)
          const initialForm: Record<string, string> = {}
          fieldData.forEach((f: any) => initialForm[f.label] = "")
          setFormData(initialForm)
        }
      } catch (err) { console.error("Fetch error:", err) }
    }
    fetchData()
  }, [apiUrl])

  // --- Mobile Info Auto-Scroll Logic ---
  useEffect(() => {
    if (!info || window.innerWidth >= 1024) return;

    const interval = setInterval(() => {
      setActiveInfoIndex((prev) => (prev + 1) % 3); // 3 items: Address, Phone, Email
    }, 4000);

    return () => clearInterval(interval);
  }, [info]);

  useEffect(() => {
    if (infoScrollRef.current && window.innerWidth < 1024) {
      const container = infoScrollRef.current;
      const cardWidth = container.querySelector('div')?.offsetWidth || 0;
      const gap = 16; // gap-4
      container.scrollTo({
        left: (cardWidth + gap) * activeInfoIndex,
        behavior: "smooth"
      });
    }
  }, [activeInfoIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, message: "" });
    try {
      const res = await fetch(`${apiUrl}/admin/contact/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSubmitted(true);
      else {
        const errorData = await res.json();
        setStatus({ loading: false, message: errorData.detail || "Error." });
      }
    } catch (err) { setStatus({ loading: false, message: "Connection failed." }); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-slate-50 p-10 rounded-[3rem] shadow-2xl text-center max-w-lg border border-slate-100 animate-in fade-in zoom-in duration-500">
          <CheckCircle size={60} className="text-blue-600 mx-auto mb-6" />
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Sent!</h2>
          <p className="text-slate-500 mt-4 mb-8 font-medium">We'll get back to you ASAP.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest shadow-xl">Back</button>
        </div>
      </div>
    );
  }

  if (!meta || !info) return <div className="h-screen bg-white flex items-center justify-center font-black italic text-slate-400 uppercase tracking-widest animate-pulse">Loading Engines...</div>

  const contactItems = [
    { label: "Address", val: info.address, icon: <MapPin size={20} /> },
    { label: "Phone", val: info.phone, icon: <Phone size={20} /> },
    { label: "Email", val: info.email, icon: <Mail size={20} /> }
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-8 md:py-8 px-4 bg-white overflow-hidden text-center">
        <h2 className="text-4xl md:text-5xl justify-center font-black text-slate-900 mb-2 uppercase italic tracking-tighter">
            {meta?.page_title || "Contact Us"}
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-base md:text-xl italic px-4">{meta?.page_subtitle}</p>
      </section>

      <section className="max-w-7xl mx-auto py-4 md:py-16 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
        
        {/* Form Container */}
        <div className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-50 order-1">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.id} className={field.field_type === "textarea" ? "col-span-2" : "col-span-1"}>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">
                    {field.label}
                  </label>
                  {field.field_type === "textarea" ? (
                    <textarea 
                      required={field.is_required}
                      value={formData[field.label] || ""}
                      onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
                      className="w-full text-slate-900 font-bold border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-600 bg-slate-50 outline-none transition-all resize-none" 
                      rows={4} 
                    />
                  ) : (
                    <input 
                      type={field.field_type} 
                      required={field.is_required}
                      value={formData[field.label] || ""}
                      onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
                      className="w-full text-slate-900 font-bold border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-600 bg-slate-50 outline-none transition-all" 
                    />
                  )}
                </div>
              ))}
            </div>
            
            <button 
              disabled={status.loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              {status.loading ? <Loader2 className="animate-spin" /> : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info: Auto-Scrolling Horizontal on Mobile, Vertical on Desktop */}
        <div className="order-2 flex flex-col gap-6">
          <div 
            ref={infoScrollRef}
            className="flex lg:flex-col overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 pb-4 lg:pb-0"
          >
            {contactItems.map((item, idx) => (
              <div key={idx} className="min-w-[85vw] lg:min-w-0 snap-center flex items-center gap-5 p-6 rounded-3xl border border-slate-100 bg-slate-50 transition-all hover:bg-white hover:shadow-lg">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div className="truncate">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.label}</p>
                  <p className="text-slate-900 font-black text-sm md:text-lg italic truncate">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dot Indicators for Mobile Info Slider */}
          <div className="flex lg:hidden justify-center gap-2">
            {contactItems.map((_, idx) => (
              <button
                key={idx}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  activeInfoIndex === idx ? "w-8 bg-blue-600" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[400px] md:h-[550px] mt-10">
        {info.latitude && info.longitude ? (
          <iframe 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(1)' }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${info.latitude},${info.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black uppercase italic tracking-widest">Map Pending Configuration</div>
        )}
      </section>
    </main>
  )
}