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
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">ARP Motors Admin</h1>

      <div className="flex gap-6 items-center">
        <Link href="/admin" className="hover:text-yellow-400">Dashboard</Link>
        <Link href="/admin/bikes" className="hover:text-yellow-400">Bikes</Link>
        <Link href="/admin/gallery" className="hover:text-yellow-400">Gallery</Link>
        <Link href="/admin/content" className="hover:text-yellow-400">Content</Link>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
