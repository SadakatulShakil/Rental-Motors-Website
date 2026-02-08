"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bike, User, Salad } from "lucide-react";
import { useEffect, useState } from "react";
import BookingForm from "./BookingForm"

export default function MobileNavbar() {
  const pathname = usePathname();
  const [showForm, setShowForm] = useState(false)
  const [motorcycleOptions, setMotorcycleOptions] = useState<string[]>([])

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    // 🔹 Fetch Real Bike Names for the Booking Form
    fetch(`${apiUrl}/admin/bikes`)
      .then(res => res.json())
      .then(data => {
        const names = data.map((bike: any) => bike.name)
        setMotorcycleOptions(names)
      })
      .catch(err => console.error("Bikes Fetch Error:", err))
  }, [apiUrl])
  
  const navItems = [
    { icon: <Home size={22} />, label: "Home", path: "/" },
    { icon: <Search size={22} />, label: "Explore", path: "/bikes" },
    { icon: <Bike size={24} />, label: "Rent", path: "#", primary: true }, // Path # as it's a trigger now
    { icon: <Salad size={22} />, label: "Benefit", path: "/include" },
    { icon: <User size={22} />, label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 z-[999] px-4 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center h-16 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            
            // 🔹 HANDLE THE RENT BUTTON TRIGGER
            if (item.primary) {
              return (
                <button 
                  key={item.label} 
                  onClick={() => setShowForm(true)} 
                  className="relative -mt-10 focus:outline-none"
                >
                  <div className="bg-blue-600 text-white p-4 rounded-full shadow-xl shadow-blue-300 border-4 border-white active:scale-90 transition-transform">
                    {item.icon}
                  </div>
                </button>
              );
            }

            return (
              <Link key={item.path} href={item.path} className="flex flex-col items-center gap-1 group">
                <div className={`transition-colors duration-200 ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                  {item.icon}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 🔹 RENDER THE FORM MODAL */}
      {showForm && (
        <div className="md:hidden"> {/* Ensure form only shows on mobile via this trigger */}
            <BookingForm 
            motorcycleOptions={motorcycleOptions} 
            onClose={() => setShowForm(false)} 
            />
        </div>
      )}
    </>
  );
}