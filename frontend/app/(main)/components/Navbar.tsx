"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { WhatsAppMobileBtn } from "./WhatsAppFloating"
import { Menu, X } from "lucide-react" // Using lucide for cleaner icons

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false) // Toggle for mobile menu

  const isActive = (path: string) => pathname === path

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
        
        {/* Logo */}
        <div className="text-xl md:text-2xl font-black tracking-tighter shrink-0">
          <Link href="/">ARP <span className="text-blue-600"> MOTORS</span></Link>
        </div>

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
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isActive(link.href) 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-slate-600 hover:text-blue-500 hover:bg-slate-50"
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
          
          {/* DESKTOP: WhatsApp after Admin */}
          <div className="pl-4">
            <WhatsAppMobileBtn />
          </div>
        </div>

        {/* MOBILE: Menu Button */}
        <div className="md:hidden shrink-0">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 🔹 ACTUAL MOBILE MENU (The part that was missing) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)} // Close menu on click
                className={`px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                  isActive(link.href) 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-600 bg-slate-50"
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