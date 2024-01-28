import { useParams } from 'react-router-dom'
import { stringToColor } from '../mapping/styles'
import Header from './components/Header'
import Map from './Map'
import BackgroundImage from './components/BackgroundImage'
import SelectionView from './components/SelectionView'
import { useState } from 'react'
import { FaLocationCrosshairs } from 'react-icons/fa6'
import { DistrictFeature, Seat, Selected, geojson, seats } from './data'

const findDistrictOfSeat = (seat: Seat) => {
  return geojson.districts.features.find(
    (feature) => feature.properties.DISTRICT === seat.district
  )
}

const DetailConditionals = ({
  selected,
  locationFeature
}: {
  selected?: Selected
  locationFeature?: DistrictFeature | false
}) => {
  let isMyConstituency = false
  if (locationFeature) {
    if (selected?.type === 'district') {
      isMyConstituency =
        selected.district.properties.DISTRICT_ID ===
        locationFeature.properties.DISTRICT_ID
    } else if (selected?.type === 'seat') {
      isMyConstituency =
        selected.seat.district === locationFeature.properties.DISTRICT
    }
  }

  if (selected?.type === 'seat') {
    return (
      <SelectionView
        isMyConstituency={isMyConstituency}
        selectedSeat={selected.seat}
      />
    )
  } else if (selected?.type === 'district') {
    return <BackgroundImage />
  } else {
    if (locationFeature === false) {
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
  const { code = null } = useParams()

  const [locationFeature, setLocationFeature] = useState<
    DistrictFeature | false | undefined
  >(undefined)

  let selected: Selected | undefined = undefined
  let selectedDistrict: DistrictFeature | undefined = undefined

  if (code) {
    const found = geojson.districts.features.find(
      (feature) =>
        parseInt(code.substring(9)) === feature.properties.DISTRICT_ID
    )
    if (found) {
      selected = {
        type: 'district',
        color: stringToColor(found.properties.DISTRICT_ID.toString()),
        district: found
      }
      selectedDistrict = found
    } else if (seats[code ?? '']) {
      selected = {
        type: 'seat',
        seat: seats[code ?? '']
      }
      selectedDistrict = findDistrictOfSeat(seats[code ?? ''])
    }
  }

  return (
    <div className="flex flex w-full h-full frame">
      <div
        className="flex flex-col w-full h-full details"
        style={{ width: '50%', maxWidth: 850 }}
      >
        <Header setLocationFeature={setLocationFeature} />
        <div className="flex flex-1 w-full">
          <DetailConditionals
            selected={selected}
            locationFeature={locationFeature}
          />
        </div>
      </div>
      <Map
        selectedDistrict={
          selected
            ? selected.type === 'district'
              ? selected.district
              : findDistrictOfSeat(selected.seat)
            : undefined
        }
      />
    </div>
  )
}

export default App
