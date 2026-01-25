import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "../globals.css"
import WhatsAppFloating from "./components/WhatsAppFloating";
import Chatbot from "./components/ChatBot";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <Chatbot/>
    </>
  );
}