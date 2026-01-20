"use client"
import Image from "next/image";
import { useState } from "react"
import BookingForm from "./BookingForm"
import Link from "next/link";

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false)
  const motorcycleOptions = ["KTM Duke 390","Yamaha R15","Honda CB500F","Royal Enfield Meteor 350"]
  
  return (
    <section className="relative w-full h-[90vh]">
      <Image
        src="/hero-bg.jpg"
        alt="Motorcycle Hero"
        fill
        priority
        className="object-cover"
      />

<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-white text-5xl md:text-7xl font-bold mb-4">
          Explore Your Dream Motorcycle
        </h1>

        <p className="text-white text-xl md:text-2xl mb-10">
          Explore, Experience, and Book Your Ride Easily
        </p>
        
        <div className="flex gap-6">
          {/* VIEW BIKES CIRCLE */}
          <Link 
            href="/bikes" 
            className="bg-red-600 text-white w-32 h-32 rounded-full text-sm font-bold hover:bg-red-700 transition-all hover:scale-110 flex items-center justify-center text-center shadow-xl leading-tight border-2 border-white/20"
          >
            VIEW<br/>BIKES
          </Link>

          {/* BOOK NOW CIRCLE */}
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 text-black w-32 h-32 rounded-full text-sm font-bold hover:bg-yellow-600 transition-all hover:scale-110 flex items-center justify-center text-center shadow-xl leading-tight border-2 border-black/10"
          >
            BOOK<br/>NOW
          </button>
        </div>
      </div>

      {showForm && <BookingForm motorcycleOptions={motorcycleOptions} onClose={() => setShowForm(false)} />}
    </section>
  );
}