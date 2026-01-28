"use client"
import { useState, useEffect } from "react"
import { CheckCircle, Mail, Phone, MapPin, Loader2 } from "lucide-react"

export default function ContactPage() {
  const [meta, setMeta] = useState<any>(null)
  const [info, setInfo] = useState<any>(null)
  const [fields, setFields] = useState<any[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [status, setStatus] = useState({ loading: false, message: "" })

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
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, message: "" });
    
    try {
      const res = await fetch("http://localhost:8000/admin/contact/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
  
      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        setStatus({ loading: false, message: errorData.detail || "Server error. Please try again." });
      }
    } catch (err) { 
      setStatus({ loading: false, message: "Failed to connect to server." }); 
    }
  };
  
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-lg border border-slate-100 animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Message Sent</h2>
          <p className="text-slate-500 mt-4 mb-10 font-medium leading-relaxed">
            Thank you for reaching out to ARP Motors. We've received your inquiry and our team will contact you <span className="text-blue-600 font-bold underline text-nowrap tracking-tighter italic">ASAP</span> to assist you.
          </p>
          <button onClick={() => window.location.reload()} className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-xs hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
            Back to Contact
          </button>
        </div>
      </div>
    );
  }

  if (!meta || !info) return <div className="h-screen bg-white animate-pulse" />

  return (
    <main className="bg-slate-50 min-h-screen">
           <section className="max-w-7xl mx-auto pt-20 px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase">
            {meta.page_title || "How Can We Help?"}
        </h2>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
            {meta.page_subtitle || "Fill out the form below or use our contact details to reach out."}
        </p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-6" />
      </section>

      {/* 🔹 3. CONTENT GRID (Form on Left, Info on Right) */}
      <section className="max-w-7xl mx-auto py-16 px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Dynamic Form Card */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1">
                    {field.label}
                </label>
                {field.field_type === "textarea" ? (
                  <textarea 
                    required={field.is_required}
                    value={formData[field.label] || ""}
                    onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
                    className="w-full text-black border-2 border-slate-100 p-3 rounded-2xl focus:border-blue-500 focus:bg-white bg-slate-50 outline-none transition-all" 
                    rows={4} 
                  />
                ) : (
                  <input 
                    type={field.field_type} 
                    required={field.is_required}
                    value={formData[field.label] || ""}
                    onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
                    className="w-full text-black border-2 border-slate-100 p-3 rounded-2xl focus:border-blue-500 focus:bg-white bg-slate-50 outline-none transition-all" 
                  />
                )}
              </div>
            ))}
            <button 
              disabled={status.loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 disabled:bg-slate-400"
            >
              {status.loading ? "Sending..." : "Send Message"}
            </button>
            {status.message && <p className="text-center font-bold text-blue-600 mt-4">{status.message}</p>}
          </form>
        </div>

        {/* Contact Info Cards Column */}
        <div className="flex flex-col justify-start space-y-6">
          {[
            { label: "Our Location", val: info.address, icon: "📍" },
            { label: "Call Us", val: info.phone, icon: "📞" },
            { label: "Email Us", val: info.email, icon: "✉️" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 p-6 rounded-3xl border border-slate-100 bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                {item.icon}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-blue-500 tracking-wider mb-1">{item.label}</p>
                <p className="text-slate-800 font-semibold text-lg">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 4. FULL WIDTH MAP */}
      <section className="w-full h-[500px] mt-10 grayscale hover:grayscale-0 transition-all duration-1000">
        {info.latitude && info.longitude ? (
          <iframe 
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${info.latitude},${info.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 italic">
            Map location not configured in Admin
          </div>
        )}
      </section>
    </main>
  )
}