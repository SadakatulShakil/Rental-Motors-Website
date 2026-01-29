import Image from "next/image";
import { Shield, Users, Settings, Fuel, Calendar, Palette, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import BikePriceCalculator from "../../components/BikePriceCalculator";
import BookNowButton from "../../components/BookingNowButton";

export default async function BikeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const { slug } = await params;
  const res = await fetch(`${apiUrl}/admin/bikes/${slug}`, { cache: 'no-store' });
  if (!res.ok) return <div className="p-20 text-center font-black uppercase">Bike not found</div>;
  const bike = await res.json();

  return (
    <section className="bg-white text-slate-900 pb-16 pt-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Link - Smaller & More Subtle */}
        <Link href="/bikes" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-8 transition-all group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform"/> Back to Vehicle
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left: Product Image - Added a subtle glow and less rounding */}
          <div className="lg:sticky lg:top-28 relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
            <Image src={bike.image} alt={bike.name} fill className="object-contain p-6 hover:scale-105 transition-transform duration-700" priority unoptimized />
          </div>

          {/* Right: Essential Info */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-md text-[9px] font-black uppercase italic tracking-tighter">New Arrival</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                   <Shield size={12} className="text-green-500"/> Verified Fleet
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase italic text-slate-950 leading-[0.9]">
                {bike.name}
              </h1>
            </div>

            {/* Calculator - Integrated smoothly */}
            <div className="rounded-[1.5rem] overflow-hidden shadow-sm">
                <BikePriceCalculator bike={bike} variant="full" />
            </div>

            {/* Quick Specs - Reduced padding and text size */}
            <div className="grid grid-cols-3 gap-3">
              <SpecBox label="Engine" value={bike.cc} icon={<Zap size={10}/>} />
              <SpecBox label="Fuel" value={bike.fuel} icon={<Fuel size={10}/>} />
              <SpecBox label="Speed" value={bike.topSpeed} icon={<Settings size={10}/>} />
            </div>

            <div className="pt-2">
              <BookNowButton bikeName={bike.name} />
            </div>
          </div>
        </div>

        {/* DETAILS GRID - More compact spacing */}
        <div className="grid md:grid-cols-2 gap-8 py-12 border-y border-slate-100 mb-12">
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Core Specifications</h2>
            <div className="grid gap-y-3">
              <InfoRow label="Year Model" value={bike.year_mf} icon={<Calendar size={14}/>} />
              <InfoRow label="Fuel Type" value={bike.fuel_use} icon={<Fuel size={14}/>} />
              <InfoRow label="Available Colors" value={bike.color} icon={<Palette size={14}/>} />
            </div>
          </div>
          <div className="space-y-4 md:border-l md:pl-8">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Handling & Type</h2>
             <div className="grid gap-y-3">
               <InfoRow label="Capacity" value={`${bike.max_passengers} Persons`} icon={<Users size={14}/>} />
               <InfoRow label="Transmission" value={bike.transmission} icon={<Settings size={14}/>} />
               <InfoRow label="Body Style" value={bike.type} icon={<Shield size={14}/>} />
             </div>
          </div>
        </div>

        {/* DESCRIPTION - Refined typography */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">About this vehicle</h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium italic italic">
            "{bike.description}"
          </p>
        </div>

        {/* CHARGE TABLE - Modernized with better contrast */}
        <section className="mt-12">
          <div className="flex justify-between items-end mb-6">
             <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">Rental Breakdown</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All prices in GBP (£)</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Duration</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Charge</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Limit</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Extra KM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bike.rental_charges?.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{row.duration}</td>
                    <td className="px-6 py-4 font-black text-blue-600 text-lg italic">{row.charge}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-500">{row.max_km}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-medium italic group-hover:text-slate-950 transition-colors">{row.extra_charge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}

function SpecBox({ label, value, icon }: { label: string, value: string, icon?: any }) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-1 mb-1">
        {icon && <span className="text-blue-500">{icon}</span>}
        <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">{label}</p>
      </div>
      <p className="text-md font-black italic uppercase text-slate-950 leading-none">{value}</p>
    </div>
  )
}

function InfoRow({ label, value, icon }: { label: string, value: any, icon: any }) {
  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-3 text-slate-400 group-hover:text-blue-500 transition-colors font-bold text-[11px] uppercase tracking-tight">
        {icon} <span>{label}</span>
      </div>
      <span className="font-bold text-slate-800 text-sm italic">{value || "---"}</span>
    </div>
  );
}