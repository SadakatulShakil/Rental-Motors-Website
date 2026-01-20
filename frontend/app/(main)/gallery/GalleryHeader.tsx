"use client"
import Image from "next/image";
import { useState } from "react"
import BookingForm from "../components/BookingForm";

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false)
  const motorcycleOptions = ["KTM Duke 390","Yamaha R15","Honda CB500F","Royal Enfield Meteor 350", "Yamaha MT-15"]
  
  return (
    <section className="relative w-full h-[90vh]">
      <Image
        src="/bike-gallery.png"
        alt="Motorcycle Hero"
        fill
        priority
        className="object-cover"
      />

<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />


      {/* 1. Changed items-center to items-start */}
      {/* 2. Changed text-center to text-left */}
      {/* 3. Added max-w-4xl to keep the text from stretching too far across the screen */}
      <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-8 md:px-20">
        <div className="max-w-xl">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-6">
            Captured Moments From Customers
            </h1>
            <p className="text-white md:text-2xl mb-8 leading-relaxed opacity-90">
            With us, you get to choose the best scooter for rental, ensuring comfort, style, and reliability throughout your journey.
            </p>
            
            <div className="flex gap-4 ">
            <button
    onClick={() => setShowForm(true)}
    className="bg-yellow-500 text-black w-32 h-32 rounded-full text-sm font-bold hover:bg-yellow-600 transition-all hover:scale-110 flex items-center justify-center text-center shadow-xl leading-tight border-1 border-black/10t"
>
    Book <br/> Now
</button>
            </div>
        </div>
      </div>
      
      {showForm && <BookingForm motorcycleOptions={motorcycleOptions} onClose={() => setShowForm(false)} />}
    </section>
  );
}