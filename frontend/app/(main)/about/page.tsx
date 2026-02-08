import AboutSection from "../components/AboutSection"
import AboutHeader from "./AboutHeader"

export default function AboutPage() {
  return (
    <main>
      <div className="hidden md:block">
        <AboutHeader/>
      </div>
      <div className="pt-20 md:pt-0">
        <AboutSection />
      </div>
    </main>
  )
}
