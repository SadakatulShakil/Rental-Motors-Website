"use client"
import Image from "next/image";
import { useState } from "react"
import BookingForm from "../components/BookingForm";

export default function AboutHeader() {
  const [showForm, setShowForm] = useState(false)
  const motorcycleOptions = ["KTM Duke 390","Yamaha R15","Honda CB500F","Royal Enfield Meteor 350", "Yamaha MT-15"]
  
  return (
    <section className="relative w-full h-[90vh]">
      <Image
        src="/banner2.jpeg"
        alt="Motorcycle Hero"
        fill
        priority
        className="object-cover"
      />

      {/* 1. Changed items-center to items-start */}
      {/* 2. Changed text-center to text-left */}
      {/* 3. Added max-w-4xl to keep the text from stretching too far across the screen */}
      <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-8 md:px-20">
        <div className="max-w-xl">
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6">
                ABOUT US
            </h1>

            <p className="text-white md:text-l mb-8 leading-relaxed opacity-90">
                Welcome to ARP Rental Scooter, the best bike renting company in the UK. We are also a leading scooter renting company in London, offering a wide range of two-wheelers and exceptional service for your commuting and touring needs. With our diverse fleet and customer-centric approach, we aim to provide the ultimate riding experience, ensuring your safety, convenience, and satisfaction.
            </p>
            
            <div className="flex gap-4 ">
            <button
    onClick={() => setShowForm(true)}
    className="bg-yellow-500 text-black w-32 h-32 rounded-full text-sm font-bold hover:bg-yellow-600 transition-all hover:scale-110 flex items-center justify-center text-center shadow-xl leading-tight border-1 border-black/10"
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