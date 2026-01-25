"use client";
import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { CheckCircle, X, Mail, Upload, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface BookingFormProps {
  motorcycleOptions?: string[];
  onClose: () => void;
  initialBike?: string;
}

// Define the shape of your form data to replace 'any'
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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Resolved e: any type for inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Resolved e: any type for files
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    if (e.target.files && e.target.files[0]) {
      if (side === 'front') setLicenseFront(e.target.files[0]);
      else setLicenseBack(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (licenseFront) data.append("license_front", licenseFront);
    if (licenseBack) data.append("license_back", licenseBack);

    try {
      const res = await fetch("http://localhost:8000/admin/bookings/send-mail", {
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
      <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={56} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950 mb-4">Awesome!</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
            Your booking inquiry is safe with us. We will review your details and <span className="text-blue-600 font-bold underline">contact you ASAP</span> to finalize your rental.
          </p>
          <button onClick={onClose} className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all transform hover:scale-[1.02]">
            Return to Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div ref={formRef} className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative my-auto text-slate-950">
        
        <div className="bg-slate-50 px-10 py-8 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200"><ShieldCheck size={24} /></div>
            <div>
               <h2 className="text-slate-950 text-2xl font-black uppercase italic leading-none tracking-tighter">Inquiry Form</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Direct secure transmission</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-slate-300 hover:text-red-500 border border-transparent hover:border-red-100"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          
          <div className="space-y-6">
            <SectionTitle title="1. Driver Information" />
            <FloatingInput label="Full Name" name="name" required onChange={handleChange} />
            <FloatingInput label="Email Address" name="email" type="email" required onChange={handleChange} />
            <FloatingInput label="Phone Number" name="phone" required onChange={handleChange} />
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Vehicle</label>
              <select name="motorcycle" value={formData.motorcycle} onChange={handleChange} required className="w-full border-b-2 border-slate-100 py-3 font-bold italic focus:border-blue-600 outline-none bg-transparent text-slate-950">
                <option value="">Select a bike...</option>
                {motorcycleOptions.map((m, i) => <option key={i} value={m} className="text-black">{m}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="2. Rental & License" />
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="Pick-up" name="startDate" type="date" required onChange={handleChange} />
              <FloatingInput label="Drop-off" name="endDate" type="date" required onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">License Type</label>
                  <select name="licenseType" required onChange={handleChange} className="border-b-2 border-slate-100 py-3 font-bold italic focus:border-blue-600 outline-none bg-transparent text-sm text-slate-950">
                    <option value="" className="text-black">Select...</option>
                    <option value="UK Full" className="text-black">UK Full</option>
                    <option value="Provisional" className="text-black">Provisional</option>
                    <option value="EU/Intl" className="text-black">EU / Intl</option>
                  </select>
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Valid CBT?</label>
                  <select name="hasCBT" required onChange={handleChange} className="border-b-2 border-slate-100 py-3 font-bold italic focus:border-blue-600 outline-none bg-transparent text-sm text-slate-950">
                    <option value="" className="text-black">Select...</option>
                    <option value="Yes" className="text-black">Yes</option>
                    <option value="No/NA" className="text-black">No/NA</option>
                  </select>
               </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <AlertCircle size={12}/> Verification Docs (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <FileUpload side="Front" onFile={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'front')} active={!!licenseFront} />
                <FileUpload side="Back" onFile={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'back')} active={!!licenseBack} />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-6">
            <button disabled={loading} type="submit" className="w-full bg-slate-950 text-white py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all flex justify-center items-center gap-4 shadow-xl shadow-slate-200">
              {loading ? <Loader2 className="animate-spin" /> : <Mail size={18} />}
              {loading ? "Transmitting..." : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 border-l-4 border-blue-600 pl-3">{title}</h3>
);

// Added text-slate-950 to ensure black text
const FloatingInput = ({ label, type = "text", ...props }: { label: string, name: string, type?: string, required?: boolean, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label} *</label>
    <input 
      type={type}
      {...props} 
      className="w-full border-b-2 border-slate-100 py-3 font-bold focus:border-blue-600 outline-none transition-all placeholder:text-slate-200 bg-transparent text-sm text-slate-950" 
    />
  </div>
);

const FileUpload = ({ side, onFile, active }: { side: string, onFile: (e: ChangeEvent<HTMLInputElement>) => void, active: boolean }) => (
  <label className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${active ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}`}>
    <Upload size={18} />
    <span className="text-[9px] font-black uppercase tracking-tighter">{active ? `${side} Ready` : `License ${side}`}</span>
    <input type="file" className="hidden" onChange={onFile} />
  </label>
);