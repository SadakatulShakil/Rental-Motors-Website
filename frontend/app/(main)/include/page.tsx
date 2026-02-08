import IncludedSection from "../components/IncludedSection"
import IncludeHeader from "./IncludeHeader"

export default function IncludePage() {
  return (
    <main>
      <div className="hidden md:block">
      <IncludeHeader/>
      </div>
      <div className="pt-20 md:pt-0">
      <IncludedSection />
      </div>
    </main>
  )
}
