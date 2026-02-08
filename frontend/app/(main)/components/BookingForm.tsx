"use client";
import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { CheckCircle, X, Mail, Upload, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface BookingFormProps {
  motorcycleOptions?: string[];
  onClose: () => void;
  initialBike?: string;
}

interface FormDataState {
  name: string;
  email: string;
  phone: string;
  motorcycle: string;
  startDate: string;
  endDate: string;
  licenseType: string;
  hasCBT: string;
  additionalInfo: string;
}

export default function BookingForm({ motorcycleOptions = [], onClose, initialBike = "" }: BookingFormProps) {
  const [formData, setFormData] = useState<FormDataState>({
    name: "", email: "", phone: "", motorcycle: initialBike || "",
    startDate: "", endDate: "", licenseType: "", hasCBT: "", additionalInfo: ""
  });
  
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and handle click outside
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleClick = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    if (e.target.files && e.target.files[0]) {
      if (side === 'front') setLicenseFront(e.target.files[0]);
      else setLicenseBack(e.target.files[0]);
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (licenseFront) data.append("license_front", licenseFront);
    if (licenseBack) data.append("license_back", licenseBack);

    try {
      const res = await fetch(`${apiUrl}/admin/bookings/send-mail`, {
        method: "POST",
        body: data,
      });

      if (res.ok) setSubmitted(true);
      else alert("Submission failed. Please check your connection.");
    } catch (err) {
      alert("Error contacting server.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center z-[1001] p-4">
        <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950 mb-2">Sent Successfully</h2>
          <p className="text-slate-500 text-sm mb-8">We will review your details and contact you ASAP.</p>
          <button onClick={onClose} className="w-full bg-slate-950 text-white py-4 rounded-xl font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end md:items-center justify-center z-[1001] md:p-4 overflow-hidden">
      <div 
        ref={formRef} 
        className="bg-white rounded-t-[2rem] md:rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative h-[90vh] md:h-auto overflow-y-auto animate-in slide-in-from-bottom-full duration-500 md:duration-300"
      >
        
        {/* Mobile Drag Indicator */}
        <div className="md:hidden flex justify-center pt-3 pb-1 sticky top-0 bg-white z-30">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Sticky Header */}
        <div className="bg-white/90 backdrop-blur px-6 md:px-10 py-4 md:py-6 flex items-center justify-between border-b border-slate-100 sticky top-0 md:relative z-20">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-slate-950 text-lg md:text-2xl font-black uppercase italic tracking-tighter">Inquiry</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-red-50 rounded-full transition-all text-slate-300 hover:text-red-500">
            <X size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
          
          {/* Column 1: Driver Info */}
          <div className="space-y-5 md:space-y-6">
            <SectionTitle title="1. Driver Details" />
            <FloatingInput label="Full Name" name="name" required onChange={handleChange} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingInput label="Phone" name="phone" required onChange={handleChange} />
              <FloatingInput label="Email" name="email" type="email" required onChange={handleChange} />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Select Vehicle</label>
              <select 
                name="motorcycle" 
                value={formData.motorcycle} 
                onChange={handleChange} 
                required 
                className="w-full border-b border-slate-200 py-2 font-bold italic focus:border-blue-600 outline-none bg-transparent text-slate-950 text-sm"
              >
                <option value="">Select a bike...</option>
                {motorcycleOptions.map((m, i) => <option key={i} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Column 2: Rental & Docs */}
          <div className="space-y-5 md:space-y-6">
            <SectionTitle title="2. Rental & License" />
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="Pick-up" name="startDate" type="date" required onChange={handleChange} />
              <FloatingInput label="Drop-off" name="endDate" type="date" required onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">License Type</label>
                  <select name="licenseType" required onChange={handleChange} className="border-b border-slate-200 py-2 font-bold focus:border-blue-600 outline-none bg-transparent text-xs text-slate-950">
                    <option value="">Select...</option>
                    <option value="UK Full">UK Full</option>
                    <option value="Provisional">Provisional</option>
                    <option value="EU/Intl">EU/Intl</option>
                  </select>
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Valid CBT?</label>
                  <select name="hasCBT" required onChange={handleChange} className="border-b border-slate-200 py-2 font-bold focus:border-blue-600 outline-none bg-transparent text-xs text-slate-950">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No/NA">No/NA</option>
                  </select>
               </div>
            </div>

            <div className="pt-2">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 mb-3">
                <AlertCircle size={10}/> Verification Docs (Optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <FileUpload side="Front" onFile={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'front')} active={!!licenseFront} />
                <FileUpload side="Back" onFile={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'back')} active={!!licenseBack} />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-4 pb-8 md:pb-0">
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 md:py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-slate-950 transition-all flex justify-center items-center gap-3 shadow-xl shadow-blue-100 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Mail size={18} />}
              {loading ? "Processing..." : "Submit Booking Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 border-l-2 border-blue-600 pl-2 leading-none">{title}</h3>
);

const FloatingInput = ({ label, type = "text", ...props }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{label} *</label>
    <input 
      type={type}
      {...props} 
      className="w-full border-b border-slate-200 py-2 font-bold focus:border-blue-600 outline-none transition-all bg-transparent text-sm md:text-sm text-slate-950" 
    />
  </div>
);

const FileUpload = ({ side, onFile, active }: any) => (
  <label className={`border border-dashed rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${active ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:shadow-md'}`}>
    <Upload size={14} />
    <span className="text-[8px] font-black uppercase tracking-tighter">{active ? `Attached` : `ID ${side}`}</span>
    <input type="file" className="hidden" onChange={onFile} />
  </label>
);