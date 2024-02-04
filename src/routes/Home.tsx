import { useParams } from 'react-router-dom'
import { stringToColor } from '../mapping/styles'
import Header from './components/Header'
import Map from './Map'
import BackgroundImage from './components/BackgroundImage'
import ConstituencyView from './components/Selection/ConstituencyView'
import { useState } from 'react'
import { FaLocationCrosshairs } from 'react-icons/fa6'
import DistrictView from './components/Selection/DistrictView'
import { DataProvider, useData, useLoadData } from '../hooks/useData'
import { GeoJsonData, SeatFeature, Selected } from '../hooks/useData/geojson'
import { Seat } from '../hooks/useData/loadPTIData'

const findDistrictOfSeat = (seat: Seat, geojson: GeoJsonData) => {
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
  let isMyDistrict = false
  if (locationFeature) {
    if (selected?.type === 'district') {
      isMyDistrict =
        selected.district.properties.DISTRICT_ID ===
        locationFeature.properties.DISTRICT_ID
    } else if (selected?.type === 'seat') {
      isMyDistrict =
        selected.seat.district === locationFeature.properties.DISTRICT
    }
  }

  if (selected?.type === 'seat') {
    return (
      <ConstituencyView
        isMyDistrict={isMyDistrict}
        selectedSeat={selected.seat}
      />
    )
  } else if (selected?.type === 'district') {
    return (
      <DistrictView
        isMyDistrict={isMyDistrict}
        selectedDistrict={selected.district}
      />
    )
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

function Inner() {
  const { code = null } = useParams()

  const [data] = useData()

  const [locationFeature, setLocationFeature] = useState<
    | {
        national: SeatFeature
        provincial?: SeatFeature
      }
    | false
    | undefined
  >(undefined)

  let selected: {
    national?: Seat
    provincial?: Seat
  } = {}

  if (code) {
    const parts = code.split('-')
    if (parts.length === 2) {
      const [assembly_code, number] = parts
      if (assembly_code === 'NA') {
        selected = {
          national: data.seats['NA-' + number.toString()]
        }
      } else if (['PB', 'PP', 'PS', 'PK'].includes(assembly_code)) {
        selected = {
          national: {},
          provincial: data.seats[code]
        }
      }
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
              : findDistrictOfSeat(selected.seat, data.geojson)
            : undefined
        }
      />
    </div>
  )
}

function App() {
  const data = useLoadData()

  if (!data) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        Loading...
      </div>
    )
  } else {
    return (
      <DataProvider initialValue={data}>
        <Inner />
      </DataProvider>
    )
  }
}

export default App
