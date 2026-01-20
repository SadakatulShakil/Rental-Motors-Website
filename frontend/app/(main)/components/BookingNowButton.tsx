"use client";

import { useState } from "react";
import BookingForm from "./BookingForm";

export default function BookNowButton({ bikeName }: { bikeName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        Book Now
      </button>

      {open && (
        <BookingForm
          motorcycleOptions={[bikeName]}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
