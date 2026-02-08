import MotorcycleList from "../components/MotorcycleList"
import BikeHeader from "./BikeHeader"

export default function BikesPage() {
  return (
    <main>
      <div className="hidden md:block">
      <BikeHeader/>
      </div>
      <div className="pt-20 md:pt-0">
      <MotorcycleList isFullPage={true}/>
      </div>
    </main>
  )
}
