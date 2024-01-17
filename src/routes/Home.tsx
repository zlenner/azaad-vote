import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import provincialSeatsGeoJson from '../geojson/provincial.json'
import { ProvincialGeoJson } from '../models'
import { useNavigate, useParams } from 'react-router-dom'
import { polygonStyle } from '../mapping/styles'
import PTIElectionSymbol from '../assets/logo.jpg'

const provincialSeats = provincialSeatsGeoJson as ProvincialGeoJson

function App() {
  const { seat = null } = useParams()
  const current = provincialSeats.features.find((f) => f.properties.PA === seat)
  const navigate = useNavigate()

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
        <div className="flex p-4 items-center justify-center relative">
          <img className="w-20 h-20 rounded-md" src={PTIElectionSymbol} />
          {/* <div className="flex h-fit ml-auto absolute right-5">
            <div className="transition h-fit text-gray-600 font-bold hover:bg-gray-50 active:bg-gray-100 rounded-md px-2 py-1 cursor-pointer">
              EN
            </div>
            <div
              className="flex bg-gray-200 flex-1 mx-1"
              style={{ width: 1 }}
            ></div>
            <div className="transition h-fit text-gray-300 hover:bg-gray-50 active:bg-gray-100 rounded-md px-2 py-1 cursor-pointer">
              UR
            </div>
          </div> */}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden" style={{ height: '100%' }}>
        <MapContainer
          className="w-full h-full"
          center={[30.656574684183685, 68.25139799853381]}
          zoom={6}
          scrollWheelZoom={true}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <GeoJSON
            data={provincialSeats.features as any}
            style={(feature) => polygonStyle(feature as any)}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>
    </div>
  )
}

export default App
