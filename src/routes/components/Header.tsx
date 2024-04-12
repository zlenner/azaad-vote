import { Link, useNavigate } from 'react-router-dom'
import PTIElectionSymbol from '../../assets/nobg.png'
import FindLocation from './FindLocation'
import SearchConstituency from './SearchConstituency'
import * as turf from '@turf/turf'
import { useData } from '../../hooks/useData'
import { SeatFeature } from '../../hooks/useData/geojson'
import { PiWallFill } from 'react-icons/pi'
import { Seat } from '../../hooks/useData/useLoadData'

const Header = ({
  setLocationFeatures,
  setSelection,
  setCurrentLocation
}: {
  setLocationFeatures: (
    location:
      | {
          national: SeatFeature
          provincial: SeatFeature
        }
      | false
  ) => void
  setCurrentLocation: (
    coords: { latitude: number; longitude: number } | undefined
  ) => void
  setSelection: (selection: { national: Seat; provincial: Seat }) => void
}) => {
  const navigate = useNavigate()
  const [data] = useData()

  const goToMyConstituency: (coords: {
    latitude: number
    longitude: number
  }) => void = (coords) => {
    // const customPoint = [31.590285443855617, 74.29916482386706]
    // const locationPoint = turf.point([customPoint[1], customPoint[0]])
    const locationPoint = turf.point([coords.longitude, coords.latitude])

    const foundNationalPolygon = data.geojson.national.features.find(
      (feature) => turf.booleanPointInPolygon(locationPoint, feature)
    )

    const foundProvincialPolygon = data.geojson.provincial.features.find(
      (feature) => turf.booleanPointInPolygon(locationPoint, feature)
    )

    if (!foundNationalPolygon || !foundProvincialPolygon) {
      setLocationFeatures(false)
      setCurrentLocation(undefined)
      navigate('/')
      return
    }

    setCurrentLocation({
      latitude: locationPoint.geometry.coordinates[1],
      longitude: locationPoint.geometry.coordinates[0]
    })

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
    <div className="flex flex-col bg-green-50 items-center justify-center relative">
      <div className="bg-red-500 w-full text-center px-2 py-2 text-white font-mono font-bold text-xs sm:text-sm">
        NOW RELEASED FOR 21 APRIL BYE-ELECTIONS
      </div>
      <Link
        to="/poster"
        className="flex mb-5 w-full items-center justify-center h-fit text-purple-700 hover:border-purple-700 hover:bg-purple-50 px-3 py-2 bg-white"
      >
        <PiWallFill className="mr-3 text-base sm:text-lg" />
        <div className="font-mono font-bold text-xs sm:text-sm">
          POSTERS NOW AVAILABLE
        </div>
      </Link>

      <img className="w-20 h-20 rounded-md mb-4 mx-4" src={PTIElectionSymbol} />
      <div className="text-center font-mono font-bold text-emerald-600 mb-4 px-4">
        One-step tool to find the PTI Candidate in your constituency.
      </div>
      <div className="flex w-full px-4 mb-4">
        <SearchConstituency />
        <FindLocation goToMyConstituency={goToMyConstituency} />
      </div>
    </div>
  )
}

export default Header
