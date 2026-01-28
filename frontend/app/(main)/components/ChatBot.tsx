"use client"
import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Minimize2, User, Sparkles } from "lucide-react"
import { CHATBOT_ICONS } from "@/lib/chatbot-icons"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false) 
  const [options, setOptions] = useState<any[]>([])
  const [chatHistory, setChatHistory] = useState([{ role: "bot", text: "Hello! 👋 I'm your assistant. How can I help you today?" }])
  const scrollRef = useRef<HTMLDivElement>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    // Show tooltip after 1 second delay on initial load
    const helpTimer = setTimeout(() => setShowHelp(true), 1000)
    
    fetch(`${apiUrl}/admin/chatbot/options`)
      .then(res => res.json())
      .then(data => setOptions(data))
      .catch(err => console.error("Chatbot fetch error:", err))

    return () => clearTimeout(helpTimer)
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chatHistory])

  const handleAction = (opt: any) => {
    setChatHistory(prev => [
      ...prev, 
      { role: "user", text: opt.label }, 
      { role: "bot", text: opt.reply_text }
    ])
  }

  return (
    <div className="fixed bottom-6 right-24 z-[99] flex flex-col items-end gap-3 max-sm:right-6">
      
      {/* 🔹 BLINKING & JUMPING TOOLTIP */}
      {!isOpen && showHelp && (
        <div className="relative group animate-bounce duration-[2000ms]">
          <div className="bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
            {/* Blinking Icon */}
            <Sparkles size={12} className="text-blue-600 animate-pulse" />
            
            {/* Blinking Text */}
            <span className="text-[10px] font-black uppercase italic tracking-tighter text-slate-900 animate-pulse">
              Need help? Chat with me
            </span>
          </div>
          {/* Tooltip Triangle */}
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-white border-r border-b border-slate-100 rotate-45"></div>
        </div>
      )}

      {isOpen && (
        <div className="w-80 md:w-96 bg-white rounded-[2.5rem] shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-slate-950 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-400">
                <User size={20}/>
              </div>
              <div className="flex flex-col">
                <span className="font-black italic uppercase text-xs tracking-tighter">ARP Assistant</span>
                <span className="text-[10px] text-green-400 uppercase font-bold tracking-widest leading-none mt-1">Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><Minimize2 size={18}/></button>
          </div>

          {/* Chat area */}
          <div ref={scrollRef} className="h-80 p-5 overflow-y-auto bg-slate-50 flex flex-col gap-4">
            {chatHistory.map((c, i) => (
              <div key={i} className={`p-4 rounded-2xl text-[11px] font-bold leading-relaxed shadow-sm max-w-[85%] ${
                c.role === "user" 
                ? "bg-blue-600 text-white self-end rounded-tr-none" 
                : "bg-white border border-slate-100 text-slate-800 self-start rounded-tl-none"
              }`}>
                {c.text}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap gap-2 justify-center shrink-0">
            {options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleAction(opt)} 
                className="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-full text-[10px] font-black text-black uppercase italic hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95"
              >
                <span className="text-blue-600">{CHATBOT_ICONS[opt.icon_name] || <MessageCircle size={14}/>}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`${isOpen ? 'bg-slate-950 rotate-90' : 'bg-blue-600 shadow-blue-600/30'} text-white p-4 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative`}
      >
        {isOpen ? <X size={28}/> : <MessageCircle size={28}/>}
        
        {!isOpen && (
            <span className="absolute inset-0 rounded-2xl bg-blue-600 animate-ping opacity-25 group-hover:hidden"></span>
        )}
      </button>
    </div>
  )
}