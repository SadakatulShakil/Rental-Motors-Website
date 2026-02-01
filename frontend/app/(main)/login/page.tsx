"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldCheck, Lock, User, Globe } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("admin_token")
      if (token) {
        router.replace("/admin")
      } else {
        setCheckingAuth(false)
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const body = new URLSearchParams({ username, password }).toString()
      const res = await fetch(`${apiUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || "Access Denied: Invalid Credentials")
        setLoading(false)
        return
      }
      localStorage.setItem("admin_token", data.access_token)
      router.replace("/admin")
    } catch (err) {
      setError("Server connection failed. Please try again.")
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    )
  }

  return (
    <div 
      className="flex items-center justify-center min-h-screen px-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }} // 🔹 Points to public/bg-admin.jpg
    >
      {/* Dynamic Overlay: Gradient from deep slate to transparent */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-slate-900/40" />

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in pt-20 duration-700">
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] overflow-hidden p-10 border border-white/20">
          
          <div className="text-center mb-10">
            <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/40 rotate-3 group">
              <ShieldCheck className="text-white" size={38} />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
              Ska <span className="text-blue-500 text-shadow-glow">Motors</span>
            </h1>
            <p className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.4em] mt-3">
              Secure Administrative Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl animate-pulse">
                <p className="text-[10px] font-black text-red-200 uppercase italic text-center tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Operator ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest hover:bg-blue-500 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Initiate Login"}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic">System v3.0.1</span>
            <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                <span className="text-[8px] font-bold text-slate-500 uppercase">Core Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}