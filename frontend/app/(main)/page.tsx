import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import GallerySection from "./components/GallerySection";
import HeroSection from "./components/HeroSection";
import IncludedSection from "./components/IncludedSection";
import MotorcycleList from "./components/MotorcycleList";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <MotorcycleList limit={4} showViewMore />
      <IncludedSection limit={4} showViewMore />
      <GallerySection limit={4} showViewMore />
      <ContactSection />
    </main>
  )
}
