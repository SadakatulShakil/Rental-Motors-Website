"use client"

import AdminGuard from "../components/AdminGuard";

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <h2 className="text-3xl font-bold mb-8 text-black">Dashboard</h2>

{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
  <StatCard title="Total Bikes" value="12" />
  <StatCard title="Gallery Images" value="48" />
  <StatCard title="Hero Sections" value="5" />
  <StatCard title="Admins" value="2" />
</div>

{/* Quick Actions */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <ActionCard title="Manage Bikes" href="/admin/bikes" />
  <ActionCard title="Manage Gallery" href="/admin/gallery" />
  <ActionCard title="Edit Home Content" href="/admin/content" />
  <ActionCard title="Contact Info" href="/admin/contact" />
</div>
    </AdminGuard>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold text-black mt-2">{value}</h3>
    </div>
  )
}

function ActionCard({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition block"
    >
      <h3 className="text-xl font-semibold text-black">{title}</h3>
      <p className="text-gray-600 mt-2">Click to manage</p>
    </a>
  )
}
