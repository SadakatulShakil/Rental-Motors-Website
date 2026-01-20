"use client"
import Link from "next/link"
import { usePathname } from "next/navigation" // 1. Import usePathname

export default function Navbar() {
  const pathname = usePathname(); // 2. Get the current path

  // Helper function to check if link is active
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Vehicles", href: "/bikes" },
    { name: "What’s Included", href: "/include" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Admin", href: "/login" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 left-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-black tracking-tighter text-slate-900">
          <Link href="/">ARP <span className="text-blue-600"> MOTORS</span></Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isActive(link.href) 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-slate-600 hover:text-blue-500 hover:bg-slate-50"
              }`}
            >
              {link.name}
              
              {/* Subtle Animated Underline for Active Link */}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button (Placeholder) */}
        <div className="md:hidden text-slate-900">
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m4 6h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}