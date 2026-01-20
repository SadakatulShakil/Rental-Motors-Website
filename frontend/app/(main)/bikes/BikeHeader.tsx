"use client"
import Image from "next/image";
import { useState, useEffect } from "react" // 🔹 Added useEffect
import BookingForm from "../components/BookingForm";

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false)
  // 🔹 State to hold bike names dynamically
  const [motorcycleOptions, setMotorcycleOptions] = useState<string[]>([])

  // 🔹 Fetch bike names from the backend on component mount
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await fetch("http://localhost:8000/admin/bikes");
        if (res.ok) {
          const data = await res.json();
          // Extract only the names for the dropdown
          const names = data.map((bike: any) => bike.name);
          setMotorcycleOptions(names);
        }
      } catch (err) {
        console.error("Failed to fetch bikes for HeroSection:", err);
        // Fallback options in case the server is down
        setMotorcycleOptions(["Standard Bike", "Premium Scooter"]);
      }
    };

    fetchBikes();
  }, []);
  
  return (
    <section className="relative w-full h-[90vh]">
      <Image
        src="/hero-bg.jpg"
        alt="Motorcycle Hero"
        fill
        priority
        unoptimized={true} // 🔹 Added for private IP compatibility
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-8 md:px-20">
        <div className="max-w-xl">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-6">
            Hire Motorcycle Rental in London
          </h1>
          <p className="text-white md:text-xl mb-8 leading-relaxed opacity-90">
            Looking for a thrilling way to explore London? Renting a motorcycle from ARP Motors is your answer! Feel the wind as you ride through iconic streets and discover hidden gems.
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
      
      {/* 🔹 Passing the dynamic list to the form */}
      {showForm && (
        <BookingForm 
          motorcycleOptions={motorcycleOptions} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </section>
  );
}