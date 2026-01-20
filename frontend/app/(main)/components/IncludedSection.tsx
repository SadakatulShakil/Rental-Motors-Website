"use client"
import { FaMotorcycle, FaShieldAlt, FaCreditCard, FaAddressBook, FaAirFreshener, FaAmazon } from "react-icons/fa"

const features = [
  {
    icon: <FaMotorcycle className="text-red-600 w-10 h-10" />,
    title: "Wide Range of Vehicles", 
    subtitle: "Choose from scooters, mopeds, and bikes to fit your needs."
  },
  {
    icon: <FaShieldAlt className="text-red-600 w-10 h-10" />,
    title: "Fully Insured",
    subtitle: "Ride safely with complete insurance coverage."
  },
  {
    icon: <FaCreditCard className="text-red-600 w-10 h-10" />,
    title: "Easy Payments",
    subtitle: "Multiple payment options for your convenience."
  },
  {
    icon: <FaAddressBook className="text-red-600 w-10 h-10" />,
    title: "Wide Range of Vehicles", 
    subtitle: "Choose from scooters, mopeds, and bikes to fit your needs."
  },
  {
    icon: <FaAirFreshener className="text-red-600 w-10 h-10" />,
    title: "Fully Insured",
    subtitle: "Ride safely with complete insurance coverage."
  },
  {
    icon: <FaAmazon className="text-red-600 w-10 h-10" />,
    title: "Easy Payments",
    subtitle: "Multiple payment options for your convenience."
  }
]

export default function IncludedSection() {
  return (
    <section id="included" className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto text-center mb-12 px-4">
        <h2 className="text-4xl font-bold text-black mb-2">What Sets Us Apart</h2>
        <h3 className="text-lg text-gray-700">
          Discover the ultimate rental service with a diverse fleet of vehicles tailored to meet your every need.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {features.map((f, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center text-center">
            {f.icon}
            <h3 className="font-semibold text-black text-xl mt-4 mb-2">{f.title}</h3>
            <p className="text-gray-700">{f.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
