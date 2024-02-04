import { useNavigate } from 'react-router-dom'
import PTIElectionSymbol from '../../assets/nobg.png'
import FindLocation from './FindLocation'
import SearchConstituency from './SearchConstituency'
import * as turf from '@turf/turf'
import { useData } from '../../hooks/useData'
import { SeatFeature } from '../../hooks/useData/geojson'
import { Seat } from '../../hooks/useData/useLoadData'

const Header = ({
  setLocationFeatures,
  setSelection
}: {
  setLocationFeatures: (
    location:
      | {
          national: SeatFeature
          provincial: SeatFeature
        }
      | false
  ) => void
  setSelection: (selection: { national: Seat; provincial: Seat }) => void
}) => {
  const navigate = useNavigate()
  const [data] = useData()

  const goToMyConstituency: (coords: {
    latitude: number
    longitude: number
  }) => void = (coords) => {
    const locationPoint = turf.point([coords.longitude, coords.latitude])

    const foundNationalPolygon = data.geojson.national.features.find(
      (feature) => turf.booleanPointInPolygon(locationPoint, feature)
    )

    const foundProvincialPolygon = data.geojson.provincial.features.find(
      (feature) => turf.booleanPointInPolygon(locationPoint, feature)
    )

    if (!foundNationalPolygon || !foundProvincialPolygon) {
      setLocationFeatures(false)
      navigate('/')
      return
    }

    setLocationFeatures({
      national: foundNationalPolygon,
      provincial: foundProvincialPolygon
    })

    setSelection({
      national: data.seats[foundNationalPolygon.properties.CONSTITUENCY_CODE],
      provincial:
        data.seats[foundProvincialPolygon.properties.CONSTITUENCY_CODE]
    })
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
