"use client"
import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Minimize2, MapPin, PoundSterling, ClipboardList, Phone, User } from "lucide-react"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    { role: "bot", text: "Hello! 👋 I'm your ARP assistant. How can I help you today?" }
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  const options = [
    { id: "price", label: "Price", icon: <PoundSterling size={14} />, reply: "Our rentals start at £40/day. Long-term rentals (7+ days) get a 15% discount! Check our Vehicles page for details." },
    { id: "location", label: "Location", icon: <MapPin size={14} />, reply: "We are located in East London. We also offer delivery services within the M25!" },
    { id: "requirements", label: "Requirements", icon: <ClipboardList size={14} />, reply: "You'll need a valid Driving License, a CBT certificate (for 125cc), and a proof of address." },
    { id: "contact", label: "Contact", icon: <Phone size={14} />, reply: "You can reach us 24/7 on WhatsApp or call our emergency line: 01751330394." },
  ]

  useEffect(() => {
    const timer = setTimeout(() => { if (!isOpen) setShowGreeting(true) }, 2000)
    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chatHistory])

  const handleOptionClick = (option: typeof options[0]) => {
    // Add user message then bot reply
    setChatHistory(prev => [
      ...prev, 
      { role: "user", text: option.label },
      { role: "bot", text: option.reply }
    ])
  }

  return (
    <div className="fixed bottom-6 right-24 z-[99] flex flex-col items-end gap-4 max-sm:right-6 max-sm:bottom-24">
      
      {isOpen && (
        <div className="w-80 md:w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header - Real Avatar Style */}
          <div className="bg-slate-950 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-400 overflow-hidden">
                   <User size={28} className="mt-2 text-white" /> {/* Real User Avatar look */}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-black uppercase italic tracking-tighter">ARP Support</p>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Always Active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div ref={scrollRef} className="h-[350px] p-6 bg-slate-50 overflow-y-auto flex flex-col gap-4 scroll-smooth">
            {chatHistory.map((chat, i) => (
              <div key={i} className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${
                chat.role === "user" 
                ? "bg-blue-600 text-white self-end rounded-tr-none" 
                : "bg-white text-slate-900 self-start rounded-tl-none border border-slate-100"
              }`}>
                {chat.text}
              </div>
            ))}
          </div>

          {/* Action Chips Container (Always stays at bottom) */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <p className="text-[9px] font-black uppercase text-slate-400 mb-3 tracking-widest ml-1 text-center">Quick Actions</p>
            <div className="flex flex-wrap gap-2 justify-center">
  {options.map((opt) => (
    <button
      key={opt.id}
      onClick={() => handleOptionClick(opt)}
      className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-4 py-2.5 rounded-full text-[11px] font-black uppercase italic transition-all duration-300 hover:text-blue-600 hover:border-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.1)] active:scale-95"
    >
      <span className="text-blue-600">{opt.icon}</span>
      {opt.label}
    </button>
  ))}
</div>
          </div>
        </div>
      )}

      {/* Greeting Pop-up */}
      {showGreeting && !isOpen && (
        <div className="bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 mb-2 animate-bounce flex items-center gap-3">
          <p className="text-xs font-black uppercase italic text-slate-900 tracking-tighter">Questions? Ask ARP 🏍️</p>
          <button onClick={() => setShowGreeting(false)}><X size={14} className="text-slate-400"/></button>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowGreeting(false); }}
        className={`${isOpen ? 'bg-slate-950 rotate-90' : 'bg-blue-600'} text-white p-4 rounded-2xl shadow-2xl transition-all duration-500`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  )
}