interface Props {
  limit?: number
  showViewMore?: boolean
}

export default function GallerySection({ limit, showViewMore = false }: Props) {
  const images = [
    "/gallery/gallery1.jpg",
    "/gallery/gallery2.jpg",
    "/gallery/gallery3.jpg",
    "/gallery/gallery4.png",
    "/gallery/gallery5.jpg",
  ]

  const imagesToShow = limit ? images.slice(0, limit) : images

  return (
    <section id="gallery" className="py-16 bg-white text-center">
      <div className="max-w-6xl mx-auto text-center mb-12 px-4">
        <h2 className="text-4xl font-bold text-black mb-2">
        Captured Moments
        </h2>
        <h3 className="text-lg text-gray-700">
        With us, you get to choose the best scooter for rental, ensuring comfort, style, and reliability throughout your journey.
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {imagesToShow.map((img, i) => (
          <div key={i} className="w-full h-60 relative">
            <img
              src={img}
              alt="Gallery"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* View More Button */}
      {showViewMore && (
        <div className="mt-10">
          <a
            href="/gallery"
            className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
          >
            View More Gallery
          </a>
        </div>
      )}
    </section>
  )
}
