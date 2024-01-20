import { useNavigate, useParams } from 'react-router-dom'
import { stringToColor } from '../mapping/styles'
import Header from './components/Header'
import Map from './Map'
import BackgroundImage from './components/BackgroundImage'
import ConstituencyView from './components/ConstituencyView'
import * as turf from '@turf/turf'
import { useState } from 'react'
import { FaLocationCrosshairs } from 'react-icons/fa6'
import { Seat, provincialGeoJson, seats } from './data'

const DetailConditionals = ({
  selected,
  locationConstituency
}: {
  selected?: {
    seat: Seat
    color: string
  }
  locationConstituency?: Seat | false
}) => {
  if (selected) {
    return (
      <ConstituencyView
        isMyConstituency={
          locationConstituency
            ? locationConstituency.seat === selected.seat.seat
            : false
        }
        selected={selected}
      />
    )
  } else {
    if (locationConstituency === false) {
      return (
        <div className="flex text-gray-400 font-mono w-full h-full items-center justify-center p-3 tracking-tighter">
          <FaLocationCrosshairs className="mr-3 text-lg" />
          Your current location is not in any of the constituencies.
        </div>
      )
    } else {
      return <BackgroundImage />
    }
  }
}

function App() {
  const { seat: seatCode = null } = useParams()
  const navigate = useNavigate()

  const [locationConstituency, setLocationConstituency] = useState<
    Seat | false | undefined
  >(undefined)

  const goToMyConstituency: (coords: {
    latitude: number
    longitude: number
  }) => void = (coords) => {
    const locationPoint = turf.point([coords.longitude, coords.latitude])

    const foundPolygon = provincialGeoJson.features.find((feature) =>
      turf.booleanPointInPolygon(locationPoint, feature)
    )

    if (!foundPolygon) {
      setLocationConstituency(false)
      navigate('/')
    } else {
      const seat = seats[foundPolygon.properties.PA]
      setLocationConstituency(seat)
      navigate('/' + seat.seat)
    }
  }

  const selectedSeat = seatCode ? seats[seatCode] : undefined

  const SELECTED = !selectedSeat
    ? undefined
    : ({
        color: stringToColor(selectedSeat.seat),
        seat: selectedSeat
      } as const)

  return (
    <div className="flex flex w-full h-full frame">
      <div
        className="flex flex-col w-full h-full details"
        style={{ width: '50%', maxWidth: 850 }}
      >
        <Header goToMyConstituency={goToMyConstituency} />
        <div className="flex flex-1 w-full">
          <DetailConditionals
            selected={SELECTED}
            locationConstituency={locationConstituency}
          />
        </div>
      </div>
      <Map selectedSeat={SELECTED?.seat} />
    </div>
  )
}

export default App
