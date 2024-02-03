import { useNavigate } from 'react-router-dom'
import PTIElectionSymbol from '../../assets/nobg.png'
import FindLocation from './FindLocation'
import SearchConstituency from './SearchConstituency'
import * as turf from '@turf/turf'
import { DistrictFeature } from '../../hooks/useData/geojson'
import { useData } from '../../hooks/useData'

const Header = ({
  setLocationFeature
}: {
  setLocationFeature: (district: DistrictFeature | false) => void
}) => {
  const navigate = useNavigate()
  const [data] = useData()
  const goToMyConstituency: (coords: {
    latitude: number
    longitude: number
  }) => void = (coords) => {
    const locationPoint = turf.point([coords.longitude, coords.latitude])

    const foundPolygon = data.geojson.districts.features.find((feature) =>
      turf.booleanPointInPolygon(locationPoint, feature)
    )

    if (!foundPolygon) {
      setLocationFeature(false)
      navigate('/')
    } else {
      const feature: DistrictFeature = foundPolygon
      setLocationFeature(feature)
      navigate('/DISTRICT-' + foundPolygon.properties.DISTRICT_ID)
    }
  }

  return (
    <div className="flex flex-col px-4 py-4 bg-green-50 items-center justify-center relative">
      <img className="w-20 h-20 rounded-md mb-5" src={PTIElectionSymbol} />
      <div className="font-mono font-bold text-emerald-600 mb-6">
        One-step tool to find the PTI Candidate in your constituency.
      </div>
      <div className="flex w-full">
        <SearchConstituency />
        <FindLocation goToMyConstituency={goToMyConstituency} />
      </div>
    </div>
  )
}

export default Header
