"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminNavbar() {
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem("admin_token")
    router.replace("/login")
  }

  return (
    <nav className="bg-gray-100 text-white px-6 py-4 flex justify-end">
      <button
          onClick={logout}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-600/10 hover:text-red-500 text-slate-500 p-4 rounded-2xl transition-all font-black italic text-[10px] uppercase tracking-widest border border-transparent hover:border-red-600/20"
        >
          Logout
        </button>
    </nav>
  )
}