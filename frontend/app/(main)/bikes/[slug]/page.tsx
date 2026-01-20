import Image from "next/image";
import { bikes } from "../data/bikes";
import React from "react";
import { CheckCircle2, Shield } from "lucide-react"; // Optional: npm install lucide-react
import BookNowButton from "../../components/BookingNowButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BikeDetailPage({ params }: PageProps) {
  const { slug } = await params;

// 🔹 Fetch dynamic data from FastAPI
const res = await fetch(`http://localhost:8000/admin/bikes/${slug}`, {
  cache: 'no-store' // Ensures you always get the latest data from Admin
});

if (!res.ok) {
  return <div className="p-20 text-center font-medium text-slate-400">Bike not found</div>;
}

const bike = await res.json();

  return (
    <section className="w-full bg-white font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        
 {/* TOP SECTION - Adjusted Grid to 60/40 */}
 <div className="grid lg:grid-cols-5 gap-12 items-start mb-24">
          
          {/* Bigger Image Column (3/5 of space) */}
          <div className="lg:col-span-3 relative group">
            {/* Soft decorative glow behind image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-blue-50 rounded-[2.5rem] blur-2xl opacity-50 -z-10" />
            
            {/* Image Container: Aspect ratio ensures sides aren't cut off */}
            <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100 bg-slate-50 transform transition-transform duration-700 hover:scale-[1.01]">
              <Image
                src={bike.image}
                alt={bike.name}
                fill
                unoptimized={true}
                className="object-cover p-2 rounded-[2rem]" // Added slight padding to prevent edge cutting
                priority
              />
            </div>
          </div>

          {/* Smaller, Tighter Details Column (2/5 of space) */}
          <div className="lg:col-span-2 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Shield size={14} /> Ready for rent
            </div>
            
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {bike.name}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl font-black text-blue-600">{bike.price}</span>
              <span className="h-6 w-px bg-slate-200"></span>
              <span className="text-slate-500 font-medium">Standard Rate</span>
            </div>

            {/* Compact Specs Row */}
            <div className="grid grid-cols-3 gap-2 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-center border-r border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Engine</p>
                <p className="text-slate-800 font-bold text-sm">{bike.cc}</p>
              </div>
              <div className="text-center border-r border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Fuel</p>
                <p className="text-slate-800 font-bold text-sm">{bike.fuel}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Speed</p>
                <p className="text-slate-800 font-bold text-sm">{bike.topSpeed}</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-lg mb-8">
              {bike.description}
            </p>

            <BookNowButton bikeName={bike.name} />
          </div>
        </div>

        {/* INFO GRID */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              Additional Information
            </h2>
            <ul className="space-y-4">
              {["Valid driving license is mandatory.", "Original NID or Passport required.", "Helmet provided with every booking.", "Security deposit may apply."].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 size={18} className="text-blue-500" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Vehicle Details</h2>
            <p className="text-slate-500 leading-relaxed">
              This motorcycle is regularly serviced to ensure safety and performance. 
              Ideal for city rides and highway cruising, offering a smooth experience 
              and modern styling.
            </p>
          </div>
        </div>

        {/* POLISHED RENTAL TABLE */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Rental Charges</h2>
              <p className="text-slate-500">Choose the plan that fits your journey</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">Charge</th>
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">Included KM</th>
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">Over Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["1 Day", "৳3,500", "120 KM", "৳20 / KM"],
                  ["3 Days", "৳10,000", "350 KM", "৳18 / KM"],
                  ["7 Days", "৳22,000", "900 KM", "৳15 / KM"],
                  ["30 Days", "৳75,000", "3,000 KM", "৳12 / KM"],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5 font-bold text-slate-900">{row[0]}</td>
                    <td className="px-6 py-5 font-bold text-blue-600">{row[1]}</td>
                    <td className="px-6 py-5 text-slate-600">{row[2]}</td>
                    <td className="px-6 py-5 text-slate-500 text-sm italic">{row[3]}</td>
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