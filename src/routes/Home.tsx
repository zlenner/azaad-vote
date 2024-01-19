import provincialSeatsGeoJson from '../geojson/provincial.json'
import candidatesJson from '../geojson/candidates.json'
import { Candidate, ProvincialFeature, ProvincialGeoJson } from '../models'
import { useNavigate, useParams } from 'react-router-dom'
import { stringToColor } from '../mapping/styles'
import Header from './components/Header'
import Map from './Map'
import BackgroundImage from './components/BackgroundImage'
import ConstituencyView from './components/ConstituencyView'
import * as turf from '@turf/turf'
import { useState } from 'react'
import { FaLocationCrosshairs } from 'react-icons/fa6'

const provincialSeats = provincialSeatsGeoJson as ProvincialGeoJson

function App() {
  const { seat = null } = useParams()
  const navigate = useNavigate()

  const [myConstituency, setMyConstituency] = useState<
    ProvincialFeature | false | undefined
  >(undefined)

  const goToMyConstituency: (coords: {
    latitude: number
    longitude: number
  }) => void = (coords) => {
    const locationPoint = turf.point([coords.longitude, coords.latitude])

    const foundPolygon = provincialSeats.features.find((feature) =>
      turf.booleanPointInPolygon(locationPoint, feature)
    )

    if (!foundPolygon) {
      setMyConstituency(false)
      navigate('/')
    } else {
      setMyConstituency(foundPolygon)
      navigate('/' + foundPolygon?.properties.PA)
    }
  }

  const selectedFeature = provincialSeats.features.find(
    (f) => f.properties.PA === seat
  )

  const SELECTED = {
    feature: selectedFeature,
    color: selectedFeature && stringToColor(selectedFeature.properties.PA),
    candidate:
      selectedFeature &&
      ((candidatesJson as any)[selectedFeature.properties.PA] as Candidate)
  }

  return (
    <div className="flex flex w-full h-full frame">
      <div
        className="flex flex-col w-full h-full details"
        style={{ width: '50%', maxWidth: 850 }}
      >
        <Header goToMyConstituency={goToMyConstituency} />
        <div className="flex flex-1 w-full">
          {!SELECTED.feature ? (
            myConstituency === false ? (
              <div className="flex text-gray-400 font-mono w-full h-full items-center justify-center p-3 tracking-tighter">
                <FaLocationCrosshairs className="mr-3 text-lg" />
                Your current location is not in any of the constituencies.
              </div>
            ) : (
              <BackgroundImage />
            )
          ) : (
            <ConstituencyView
              isMyConstituency={myConstituency === SELECTED.feature}
              feature={SELECTED.feature}
              color={SELECTED.color ?? ''}
              candidate={SELECTED.candidate}
            />
          )}
        </div>
      </div>
      <Map selectedConstituency={SELECTED.feature} />
    </div>
  )
}

export default App
