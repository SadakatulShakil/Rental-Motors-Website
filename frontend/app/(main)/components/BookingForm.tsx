"use client";
import { useState } from "react";

interface BookingFormProps {
  motorcycleOptions?: string[];
  onClose: () => void;
}

export default function BookingForm({
  motorcycleOptions = [],
  onClose,
}: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [motorcycle, setMotorcycle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-xl relative">
        
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-2xl font-semibold">
            Book Your Scooter
          </h2>
          <button
            onClick={onClose}
            className="text-white text-2xl leading-none hover:opacity-80"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-black"
        >
          {/* Full Name */}
          <div>
            <label className="block font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+44 7593 799975"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Motorcycle */}
          <div>
            <label className="block font-medium mb-1">
              Select Motorcycle
            </label>
            <select
              value={motorcycle}
              onChange={(e) => setMotorcycle(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a motorcycle</option>
              {motorcycleOptions.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block font-medium mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block font-medium mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Special Requests */}
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Any special requests or additional information..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
