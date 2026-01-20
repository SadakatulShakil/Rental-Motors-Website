export default function Footer() {
    return (
      <footer className="bg-black text-white py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Motorcycle Company. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-red-500">Facebook</a>
            <a href="#" className="hover:text-red-500">Instagram</a>
            <a href="#" className="hover:text-red-500">Twitter</a>
          </div>
        </div>
      </footer>
    )
  }
  