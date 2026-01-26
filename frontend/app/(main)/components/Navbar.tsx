"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { WhatsAppMobileBtn } from "./WhatsAppFloating"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null) // 🔹 State for Logo

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    // Fetch settings to get the dynamic logo_url
    fetch("http://localhost:8000/admin/footer")
      .then(res => res.json())
      .then(data => setLogoUrl(data.logo_url))
      .catch(err => console.error("Logo fetch error:", err))
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Vehicles", href: "/bikes" },
    { name: "What’s Included", href: "/include" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Admin", href: "/login", newTab: true },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 left-0 z-50 border-b border-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          ) : (
            <div className="h-10 w-10 bg-slate-100 animate-pulse rounded-lg" />
          )}
          <div className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none">
            ARP <span className="text-blue-600"> MOTORS</span>
          </div>
        </Link>

        {/* MOBILE ONLY: WhatsApp Center */}
        <div className="md:hidden flex-grow flex justify-center">
          <WhatsAppMobileBtn />
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.newTab ? "_blank" : "_self"}
              className={`relative px-4 py-2 rounded-full text-[13px] font-black uppercase italic tracking-tight transition-all duration-300 ${
                isActive(link.href) 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
          
          <div className="pl-4">
            <WhatsAppMobileBtn />
          </div>
        </div>

        {/* MOBILE: Menu Button */}
        <div className="md:hidden shrink-0">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-900"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-300 overflow-hidden">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-6 py-4 rounded-2xl text-sm font-black uppercase italic transition-all ${
                  isActive(link.href) 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-600 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}