import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "../globals.css"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}