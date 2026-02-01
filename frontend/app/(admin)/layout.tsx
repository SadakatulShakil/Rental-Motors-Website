"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 🔹 Import usePathname
import AdminNavbar from "./components/AdminNavBar";
import { 
  Menu, 
  LayoutDashboard, 
  GalleryThumbnails,
  Info, 
  CheckCircle, 
  Bike, 
  Image as ImageIcon, 
  Phone,
  ChevronLeft,
  ScanSearch,
  BotMessageSquare
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname(); // 🔹 Get current path

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
            <span className="font-bold text-xl text-black ml-2 transition-opacity italic tracking-tighter uppercase">
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
        <nav className="p-3 space-y-1 flex-1 mt-4">
          <SidebarLink 
            href="/admin" 
            label="Dashboard" 
            icon={<LayoutDashboard size={20} />} 
            collapsed={isCollapsed} 
            active={pathname === "/admin"} // 🔹 Check if active
          />
          <SidebarLink 
            href="/admin/hero" 
            label="Banner Section" 
            icon={<GalleryThumbnails size={20} />} 
            collapsed={isCollapsed} 
            active={pathname === "/admin/hero"}
          />
          <SidebarLink 
            href="/admin/about" 
            label="About Section" 
            icon={<Info size={20} />} 
            collapsed={isCollapsed} 
            active={pathname === "/admin/about"}
          />
          <SidebarLink 
            href="/admin/include" 
            label="What's Included" 
            icon={<CheckCircle size={20} />} 
            collapsed={isCollapsed} 
            active={pathname === "/admin/include"}
          />
          <SidebarLink 
            href="/admin/bikes" 
            label="Bikes" 
            icon={<Bike size={20} />} 
            collapsed={isCollapsed} 
            active={pathname.startsWith("/admin/bikes")} // 🔹 Handles sub-routes
          />
          <SidebarLink 
            href="/admin/gallery" 
            label="Gallery" 
            icon={<ImageIcon size={20} />} 
            collapsed={isCollapsed} 
            active={pathname === "/admin/gallery"}
          />
          <SidebarLink 
            href="/admin/contact" 
            label="Contact Info" 
            icon={<Phone size={20} />} 
            collapsed={isCollapsed} 
            active={pathname === "/admin/contact"}
          />
          <SidebarLink 
            href="/admin/footer" 
            label="Footer Info" 
            icon={<ScanSearch size={20} />} 
            collapsed={isCollapsed} 
            active={pathname === "/admin/footer"}
          />
           <SidebarLink 
            href="/admin/chatbot" 
            label="Chat Bot" 
            icon={<BotMessageSquare size={20} />} 
            collapsed={isCollapsed} 
            active={pathname === "/admin/chatbot"}
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

// 🔹 Updated SidebarLink Component with Active State Logic
function SidebarLink({ 
  href, 
  label, 
  icon, 
  collapsed,
  active 
}: { 
  href: string; 
  label: string; 
  icon: React.ReactNode; 
  collapsed: boolean;
  active: boolean; 
}) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-4 px-3 py-3 rounded-xl transition-all group overflow-hidden relative
        ${active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold" 
          : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
        }
      `}
      title={collapsed ? label : ""}
    >
      {/* Active Indicator Bar (Vertical) */}
      {active && !collapsed && (
        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full" />
      )}

      <div className={`min-w-[24px] flex justify-center transition-transform ${active ? "scale-110" : "group-hover:scale-110"}`}>
        {icon}
      </div>
      
      <span className={`text-[13px] uppercase tracking-tight whitespace-nowrap transition-all duration-200 ${
        collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
      }`}>
        {label}
      </span>
    </Link>
  );
}