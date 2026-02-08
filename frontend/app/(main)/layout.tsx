import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "../globals.css";
import Chatbot from "./components/ChatBot";
import MobileNavbar from "./components/MobileNav";
import WhatsAppFloating from "./components/WhatsAppFloating"; // 🔹 Import the floating button

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Navbar: Visible on all devices. 
          Desktop shows links; Mobile shows logo + Hamburger.
      */}
      <Navbar /> 
      
      {/* Main Content: pb-24 on mobile prevents the MobileNavbar (h-16) 
          and WhatsApp bubble from covering the bottom of your pages. 
      */}
      <main className="min-h-screen pb-24 md:pb-0">
        {children}
      </main>

      {/* 🔹 DESKTOP ONLY SECTION */}
      <div className="hidden md:block">
        <Footer />
        <Chatbot />
      </div>

      {/* 🔹 MOBILE ONLY SECTION */}
      <div className="md:hidden">
        {/* This bubble only renders on mobile (md:hidden inside component).
            It sits above the MobileNavbar.
        */}
        <WhatsAppFloating />
      </div>
      
      {/* 🆕 Mobile App-style bottom navigation */}
      <MobileNavbar />
    </>
  );
}