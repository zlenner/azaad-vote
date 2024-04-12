import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import Map from './Map'
import BackgroundImage from './components/BackgroundImage'
import ConstituencyView from './components/Selection/ConstituencyView'
import { useMemo, useState } from 'react'
import { FaLocationCrosshairs } from 'react-icons/fa6'
import { DataProvider, Selected, useData } from '../hooks/useData'
import { SeatFeature } from '../hooks/useData/geojson'
import { Seat, useLoadData } from '../hooks/useData/useLoadData'
import * as turf from '@turf/turf'

const DetailConditionals = ({
  selected,
  locationFeatures
}: {
  selected?: Selected
  locationFeatures?:
    | {
        national: SeatFeature
        provincial: SeatFeature
      }
    | false
    | undefined
}) => {
  if (selected?.national || selected?.provincial) {
    const seatToView =
      !selected.primary || selected.primary === 'provincial'
        ? selected.provincial
        : selected.national

    if (!seatToView) {
      throw new Error('UNKNOWN ERROR WITH CONDITIONALS')
    }

    return <ConstituencyView isMyDistrict={false} selectedSeat={seatToView} />
  } else {
    if (locationFeatures === false) {
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

function Home() {
  const { code = null } = useParams()

  const [data] = useData()

  const [currentLocation, setCurrentLocation] = useState<
    | {
        latitude: number
        longitude: number
      }
    | undefined
  >()
  const [locationFeatures, setLocationFeatures] = useState<
    | {
        national: SeatFeature
        provincial: SeatFeature
      }
    | false
    | undefined
  >(undefined)

  const selected = useMemo((): Selected => {
    if (!code) {
      return {
        primary: false
      }
    }

    const parseSeatCode = (code: string, type: 'national' | 'provincial') => {
      const parts = code.split('-')
      if (parts.length !== 2) {
        return
      }

      const [assembly_code, number] = parts
      if (assembly_code === 'NA' && type === 'national') {
        return data.seats[code]
      } else if (
        ['PB', 'PP', 'PS', 'PK'].includes(assembly_code) &&
        type === 'provincial'
      ) {
        return data.seats[code]
      }
    }

    if (code.includes('&')) {
      const [primary_code, secondary_code] = code.split('&', 2)
      const [national, provincial] = primary_code.startsWith('NA-')
        ? [
            parseSeatCode(primary_code, 'national'),
            parseSeatCode(secondary_code, 'provincial')
          ]
        : [
            parseSeatCode(secondary_code, 'national'),
            parseSeatCode(primary_code, 'provincial')
          ]

      return {
        national,
        provincial,
        primary: primary_code === national?.seat ? 'national' : 'provincial'
      }
    } else {
      if (code.startsWith('NA-')) {
        return {
          national: parseSeatCode(code, 'national'),
          primary: 'national'
        }
      } else {
        const PROVINCIAL_SEAT = parseSeatCode(code, 'provincial')
        if (!PROVINCIAL_SEAT) {
          return {
            primary: false
          }
        }

        // Try to find national seat using NA-PA mapping
        const found = Object.entries(data.na_pa_mapping).find(([key, list]) =>
          list.includes(code)
        )
        if (found) {
          console.log('FOUND NATIONAL SEAT USING NA-PA MAPPING')

          const [national_seat_code] = found
          return {
            national: parseSeatCode(national_seat_code, 'national'),
            provincial: PROVINCIAL_SEAT,
            primary: 'provincial'
          }
        }

        // Try to find national seat using provincial co-ordinates
        const provincial_feature = data.geojson.provincial.features.find(
          (feature) => feature.properties.CONSTITUENCY_CODE === code
        )
        if (provincial_feature) {
          const provincial_center = turf.point([
            parseFloat(provincial_feature.properties.longitude),
            parseFloat(provincial_feature.properties.latitude)
          ])

          const foundNationalFeature = data.geojson.national.features.find(
            (feature) => turf.booleanPointInPolygon(provincial_center, feature)
          )

          if (foundNationalFeature) {
            const national_code =
              foundNationalFeature.properties.CONSTITUENCY_CODE
            console.log('FOUND NATIONAL SEAT USING PROVINCIAL CO-ORDINATES')
            return {
              national: parseSeatCode(national_code, 'national'),
              provincial: PROVINCIAL_SEAT,
              primary: 'provincial'
            }
          }
        }

        // Couldn't find national seat, we're ignoring the provincial we found
        return {
          primary: false
        }
      }
    }
  }, [code])

  const navigate = useNavigate()

  const setSelection = (selection: { national: Seat; provincial: Seat }) => {
    navigate(`/${selection.national.seat}&${selection.provincial.seat}`)
  }

  return (
    <div className="flex flex w-full h-full frame">
      <div
        className="flex flex-col w-full h-full details"
        style={{ width: '50%', maxWidth: 850 }}
      >
        <Header
          setLocationFeatures={setLocationFeatures}
          setCurrentLocation={setCurrentLocation}
          setSelection={setSelection}
        />
        <div className="flex flex-1 h-0 overflow-auto w-full">
          <DetailConditionals
            selected={selected}
            locationFeatures={locationFeatures}
          />
        </div>
      </div>
      <Map selected={selected} currentLocation={currentLocation} />
    </div>
  )
}

export default Home
