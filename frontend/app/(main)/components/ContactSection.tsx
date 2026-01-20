"use client"

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-black text-center mb-12">Contact Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow">
            <form className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="border border-gray-300 text-black px-3 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-300 text-black px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Subject"
                className="border border-gray-300 text-black px-3 py-2 rounded"
              />
              <textarea
                placeholder="Message"
                rows={5}
                className="border border-gray-300 text-black px-3 py-2 rounded"
              ></textarea>
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-6 text-gray-700">
            <div>
              <h3 className="font-semibold text-xl mb-1">Address</h3>
              <p>123 Motor Street, City Name, Country</p>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-1">Phone</h3>
              <p>+123 456 7890</p>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-1">Email</h3>
              <p>info@arpmotors.com</p>
            </div>

            {/* Optional Map
            <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500 rounded">
              Map Placeholder
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}
