import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import provincialSeatsGeoJson from '../geojson/provincial.json'
import candidatesJson from '../geojson/candidates.json'
import { Candidate, ProvincialGeoJson } from '../models'
import { useNavigate, useParams } from 'react-router-dom'
import { polygonStyle } from '../mapping/styles'
import PTIElectionSymbol from '../assets/nobg.png'
import { FaLocationCrosshairs } from 'react-icons/fa6'
import Header from './components/Header'
import Map from './Map'
import BackgroundImage from './components/BackgroundImage'
import ConstituencyView from './components/ConstituencyView'

const provincialSeats = provincialSeatsGeoJson as ProvincialGeoJson

function App() {
  const { seat = null } = useParams()
  const navigate = useNavigate()

  const currentFeature = provincialSeats.features.find(
    (f) => f.properties.PA === seat
  )

  const CURRENT = {
    feature: currentFeature,
    style: currentFeature && polygonStyle(currentFeature),
    candidate:
      currentFeature &&
      ((candidatesJson as any)[currentFeature.properties.PA] as Candidate)
  }

  // Attach event handlers to each feature
  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: (event: any) => {
        const layer = event.target
        layer.setStyle({
          fillOpacity: 0.9
        })
      },
      mouseout: (event: any) => {
        const layer = event.target
        layer.setStyle({
          fillOpacity: 0.6
        })
      },
      click: (event: any) => {
        const layer = event.target
        navigate('/' + layer.feature.properties.PA)
      }
    })
  }

  return (
    <div className="flex flex w-full h-full">
      <div
        className="flex flex-col w-full h-full"
        style={{ width: '50%', maxWidth: 850 }}
      >
        <Header goToMyConstituency={() => {}} />
        <div className="flex flex-1 w-full">
          {!(CURRENT.style && CURRENT.feature) ? (
            <BackgroundImage />
          ) : (
            <ConstituencyView
              feature={CURRENT.feature}
              color={CURRENT.style.fillColor}
              candidate={CURRENT.candidate}
            />
          )}
        </div>
      </div>
      <Map />
    </div>
  )
}

export default App
