"use client"; // Required for useState

import { useState } from "react";
import Link from "next/link";
import AdminNavbar from "./components/AdminNavBar";
// Import icons from a library like lucide-react (Standard in Next.js projects)
import { 
  Menu, 
  LayoutDashboard, 
  Info, 
  CheckCircle, 
  Bike, 
  Image as ImageIcon, 
  Phone,
  ChevronLeft
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside 
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-white border-r flex flex-col fixed h-full transition-all duration-300 ease-in-out z-50`}
      >
        {/* LOGO AREA */}
        <div className="p-4 h-20 flex items-center justify-between border-b border-gray-100">
          {!isCollapsed && (
            <span className="font-bold text-xl text-black ml-2 transition-opacity">
              ARP <span className="text-blue-600">MOTORS</span>
            </span>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg mx-auto transition-colors text-black"
          >
            {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="p-3 space-y-2 flex-1 mt-4">
          <SidebarLink 
            href="/admin" 
            label="Dashboard" 
            icon={<LayoutDashboard size={22} />} 
            collapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/admin/about" 
            label="About Section" 
            icon={<Info size={22} />} 
            collapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/admin/include" 
            label="What's Included" 
            icon={<CheckCircle size={22} />} 
            collapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/admin/bikes" 
            label="Bikes" 
            icon={<Bike size={22} />} 
            collapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/admin/gallery" 
            label="Gallery" 
            icon={<ImageIcon size={22} />} 
            collapsed={isCollapsed} 
          />
          <SidebarLink 
            href="/admin/contact" 
            label="Contact Info" 
            icon={<Phone size={22} />} 
            collapsed={isCollapsed} 
          />
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <AdminNavbar />
        <main className="p-8 text-black">
          {children}
        </main>
      </div>
    </div>
  );
}

// Updated SidebarLink Component
function SidebarLink({ 
  href, 
  label, 
  icon, 
  collapsed 
}: { 
  href: string; 
  label: string; 
  icon: React.ReactNode; 
  collapsed: boolean 
}) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 px-3 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group overflow-hidden`}
      title={collapsed ? label : ""} // Show tooltip when collapsed
    >
      <div className="min-w-[24px] flex justify-center">
        {icon}
      </div>
      
      <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${
        collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
      }`}>
        {label}
      </span>
    </Link>
  );
}