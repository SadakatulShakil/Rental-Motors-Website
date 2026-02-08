import ContactSection from "../components/ContactSection"
import ContactHeader from "./ContactHeader"

export default function ContactPage() {
  return (
    <main>
      <div className="hidden md:block">
      <ContactHeader/>
      </div>
      <div className="pt-20 md:pt-0">
      <ContactSection />
      </div>
    </main>
  )
}
