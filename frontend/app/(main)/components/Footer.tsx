"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone, Building } from "lucide-react"

export default function Footer() {
  const [footerSettings, setFooterSettings] = useState<any>(null)
  const [contactInfo, setContactInfo] = useState<any>(null)
  const [bikes, setBikes] = useState([])
  const [error, setError] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [settingsRes, contactRes, bikesRes] = await Promise.all([
          fetch(`${apiUrl}/admin/footer`),
          fetch(`${apiUrl}/admin/contact/info`),   
          fetch(`${apiUrl}/admin/bikes`)     
        ])

        if (settingsRes.ok) setFooterSettings(await settingsRes.json())
        if (contactRes.ok) setContactInfo(await contactRes.json())
        if (bikesRes.ok) setBikes((await bikesRes.json()).slice(0, 4))
      } catch (e) {
        console.error("Error loading footer data:", e)
        setError(true)
      }
    }
    fetchAllData()
  }, [apiUrl])

  if (error) return <footer className="bg-[#0f172a] p-10 text-center text-slate-500 uppercase text-[10px] tracking-widest">Footer failed to load.</footer>
  if (!footerSettings) return <footer className="bg-[#0f172a] h-64 animate-pulse" />

  return (
    <footer className="bg-[#0f172a] text-slate-400 pt-16 pb-8 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* --- BRANDING SECTION --- */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start gap-4 max-w-2xl">
             {/* Logo and Title Group */}
             <div className="flex items-center gap-4">
                {footerSettings.logo_url && (
                  <img 
                    src={footerSettings.logo_url} 
                    alt="Company Logo" 
                    className="h-16 w-auto object-contain" // Fixed height for consistency
                    onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if broken
                  />
                )}
                <span className="text-2xl font-black italic tracking-tighter text-white uppercase">
                  {footerSettings.site_title || "SKA MOTORS"}
                </span>
             </div>

             {/* Slogans */}
             <div className="space-y-2 text-center md:text-left">
                <p className="text-sm leading-relaxed italic text-slate-300 font-medium">
                  {footerSettings.slogan || "Your commitment to excellence guarantees a satisfying rental experience."}
                </p>
                {/* 🔹 SUB SLOGAN ADDED HERE */}
                {footerSettings.sub_slogan && (
                  <p className="text-[11px] uppercase tracking-[0.2em] text-blue-500 font-black">
                    {footerSettings.sub_slogan}
                  </p>
                )}
             </div>
          </div>
        </div>

        <hr className="border-slate-800/50 mb-12" />

        {/* --- COLUMNS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Column 1: Explore */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs border-l-4 border-blue-600 pl-3">Explore</h4>
            <ul className="space-y-4 text-sm font-bold uppercase italic">
              <li><Link href="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link href="/bikes" className="hover:text-blue-500 transition-colors">Vehicles</Link></li>
              <li><Link href="/include" className="hover:text-blue-500 transition-colors">What's Included</Link></li>
              <li><Link href="/gallery" className="hover:text-blue-500 transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 2: Motorcycles */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs border-l-4 border-blue-600 pl-3">Featured Bikes</h4>
            <ul className="space-y-4 text-sm font-bold uppercase italic">
              {bikes.length > 0 ? bikes.map((bike: any) => (
                <li key={bike.id}>
                  <Link href={`/bikes/${bike.slug}`} className="hover:text-blue-500 transition-colors">{bike.name}</Link>
                </li>
              )) : <li className="text-slate-600">No bikes listed</li>}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs border-l-4 border-blue-600 pl-3">Contact Us</h4>
            <div className="space-y-5 text-[11px] font-medium tracking-wide">
              {contactInfo ? (
                <>
                  <div className="flex gap-4 items-start"><Building size={16} className="text-blue-500 shrink-0" /><p>{contactInfo.address}</p></div>
                  <div className="flex gap-4 items-center"><Mail size={16} className="text-blue-500 shrink-0" /><p>{contactInfo.email}</p></div>
                  <div className="flex gap-4 items-center"><Phone size={16} className="text-blue-500 shrink-0" /><p>{contactInfo.phone}</p></div>
                </>
              ) : <p>Loading contact details...</p>}
            </div>
          </div>
        </div>

        {/* --- SOCIAL & COPYRIGHT --- */}
        <div className="pt-10 border-t border-slate-800/50 flex flex-col items-center gap-8">
          <div className="flex gap-4">
            <SocialIcon href={footerSettings.facebook} icon={<Facebook size={18} />} color="bg-[#1877F2]" />
            <SocialIcon href={footerSettings.twitter} icon={<Twitter size={18} />} color="bg-[#1DA1F2]" />
            <SocialIcon href={footerSettings.instagram} icon={<Instagram size={18} />} color="bg-[#E4405F]" />
            <SocialIcon href={footerSettings.youtube} icon={<Youtube size={18} />} color="bg-[#FF0000]" />
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-600">
              © {new Date().getFullYear()} {footerSettings.site_title || "SKA MOTORS"}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ href, icon, color }: { href: string; icon: any; color: string }) {
  if (!href || href.trim() === "") return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${color} text-white w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all shadow-lg shadow-black/20`}>
      {icon}
    </a>
  )
}