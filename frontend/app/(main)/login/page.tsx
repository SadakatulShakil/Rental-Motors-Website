"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldCheck, Lock, User } from "lucide-react"

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
        // Optional: Verify token with /admin/me to ensure it hasn't expired
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
      // Using URLSearchParams as OAuth2 expects x-www-form-urlencoded
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
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 border border-slate-100">
          
          <div className="text-center mb-10">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg shadow-blue-600/20">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
              Admin Portal
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              Authentication Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3">
                <p className="text-xs font-bold text-red-600 uppercase italic tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
                  placeholder="admin_id"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl font-bold outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl font-bold outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black italic uppercase tracking-widest hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-950/10 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify Access"}
            </button>
          </form>

          <p className="text-[9px] text-center text-slate-400 mt-8 font-bold uppercase tracking-widest">
            Protected Environment &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}