"use client"
import { useState } from "react"

export default function BikePriceCalculator({ bike, variant = "compact" }: { bike: any, variant?: "compact" | "full" }) {
  const [days, setDays] = useState(1)

  const getDynamicPrice = () => {
    const charges = bike.rental_charges || []
    if (charges.length < 4) return bike.price // Fallback

    // Logic for tiers: Daily, 7 Days, 2 Weeks, 1 Month
    if (days >= 30) return parseInt(charges[3].charge.replace(/\D/g, ''))
    if (days >= 14) return parseInt(charges[2].charge.replace(/\D/g, ''))
    if (days >= 7) return parseInt(charges[1].charge.replace(/\D/g, ''))
    
    const dailyRate = parseInt(charges[0].charge.replace(/\D/g, ''))
    return dailyRate * days
  }

  const isFull = variant === "full"

  return (
    <div className={`${isFull ? "bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl" : "bg-white p-4 rounded-xl border border-slate-100"}`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className={`font-black uppercase italic tracking-tighter ${isFull ? "text-xl" : "text-sm text-slate-900"}`}>
          {isFull ? "Trip Price Estimator" : "Quick Quote"}
        </h4>
        <span className="text-blue-500 font-black italic">{days} {days === 1 ? 'Day' : 'Days'}</span>
      </div>

      <input 
        type="range" min="1" max="30" value={days} 
        onChange={(e) => setDays(parseInt(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-6"
      />

      <div className="flex justify-between items-end">
        <div>
          <p className={`uppercase font-bold tracking-widest ${isFull ? "text-[10px] text-slate-400" : "text-[8px] text-slate-500"}`}>Total Est.</p>
          <p className={`${isFull ? "text-4xl" : "text-2xl"} font-black italic text-blue-600`}>
            £{getDynamicPrice()}
          </p>
        </div>
        {isFull && (
           <p className="text-[10px] text-slate-500 italic max-w-[100px] text-right">
             Includes {days >= 7 ? "Long-term discount" : "Standard rate"}
           </p>
        )}
      </div>
    </div>
  )
}