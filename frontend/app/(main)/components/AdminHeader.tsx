"use client"
import Link from "next/link"

export default function AdminHeader() {
  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    window.location.href = "/main/login"
  }

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div className="flex gap-4">
        <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition">Logout</button>
      </div>
    </header>
  )
}
