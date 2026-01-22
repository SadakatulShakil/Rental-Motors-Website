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
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
    </nav>
  )
}
