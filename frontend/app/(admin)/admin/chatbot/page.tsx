"use client"
import { useState, useEffect } from "react"
import { Save, Plus, Trash2, MessageSquare, Loader2, Info } from "lucide-react"
import { CHATBOT_ICONS } from "@/lib/chatbot-icons"

export default function ChatbotAdmin() {
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8000/admin/chatbot/options")
      .then(res => res.json())
      .then(data => {
        setOptions(data);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/admin/chatbot/options/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });
      if (res.ok) alert("Chatbot Settings Saved!");
    } catch (err) {
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (idx: number, field: string, val: string) => {
    const next = [...options];
    next[idx][field] = val;
    setOptions(next);
  };

  const deleteOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  if (fetching) return <div className="p-10 text-center animate-pulse italic font-black">Loading Bot Config...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Chatbot Assistant</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interactive Quick-Reply Management</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black italic flex items-center gap-2 hover:bg-slate-900 transition-colors disabled:opacity-50 shadow-lg shadow-blue-900/10"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} SAVE CHANGES
        </button>
      </div>

      <div className="space-y-8">
        <SectionHeader icon={<MessageSquare size={18}/>} title="Response Chips" />
        
        <div className="grid grid-cols-1 gap-6">
          {options.map((opt, i) => (
            <div key={i} className="group relative bg-slate-50/50 border-2 border-slate-100 p-8 rounded-[2rem] hover:border-blue-100 transition-all">
              
              {/* Delete Button */}
              <button 
                onClick={() => deleteOption(i)}
                className="absolute top-2 right-6 p-2 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-100 transition-all"
              >
                <Trash2 size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Side: Meta */}
                <div className="space-y-6">
                  <AdminInput 
                    label="Button Label" 
                    value={opt.label} 
                    onChange={(e: any) => updateField(i, 'label', e.target.value)} 
                    placeholder="e.g. Pricing"
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Icon</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-white border-b-2 border-slate-100 py-3 font-bold outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer"
                        value={opt.icon_name}
                        onChange={(e) => updateField(i, 'icon_name', e.target.value)}
                      >
                        {Object.keys(CHATBOT_ICONS).map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                        {CHATBOT_ICONS[opt.icon_name]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Reply Content */}
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                       Assistant Reply <Info size={12} className="text-blue-500" />
                    </label>
                    <textarea 
                      value={opt.reply_text} 
                      onChange={(e: any) => updateField(i, 'reply_text', e.target.value)} 
                      rows={4} 
                      placeholder="Enter the automated response..."
                      className="w-full border-2 border-white bg-white rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all resize-none shadow-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Button */}
          <button 
            onClick={() => setOptions([...options, { label: '', icon_name: 'HelpCircle', reply_text: '' }])}
            className="w-full py-2 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50/30 transition-all group"
          >
            <div className="p-4 bg-slate-50 rounded-full group-hover:bg-white group-hover:shadow-md transition-all">
              <Plus size={32} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] italic">Add New Action Chip</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Internal UI Components to match your style ---
const SectionHeader = ({ icon, title }: any) => (
  <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
    <div className="text-blue-600">{icon}</div>
    <h2 className="text-sm font-black uppercase italic tracking-widest text-slate-900">{title}</h2>
  </div>
);

const AdminInput = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <input {...props} className="w-full border-b-2 border-slate-100 py-3 font-bold outline-none focus:border-blue-600 transition-all text-slate-900" />
  </div>
);