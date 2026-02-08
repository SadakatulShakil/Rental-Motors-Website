import GallerySection from "../components/GallerySection"
import GalleryHeader from "./GalleryHeader"

export default function GalleryPage() {
  return (
    <main>
      <div className="hidden md:block">
      <GalleryHeader/>
      </div>
      <div className="pt-20 md:pt-0">
      <GallerySection isFullPage={true}/>
      </div>
    </main>
  )
}
