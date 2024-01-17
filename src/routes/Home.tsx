import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import provincialSeatsGeoJson from '../geojson/provincial.json'
import { ProvincialGeoJson } from '../models'
import { useNavigate, useParams } from 'react-router-dom'
import { polygonStyle } from '../mapping/styles'
import PTIElectionSymbol from '../assets/nobg.png'
import { FaLocationCrosshairs } from 'react-icons/fa6'

const provincialSeats = provincialSeatsGeoJson as ProvincialGeoJson

function App() {
  const { seat = null } = useParams()
  const navigate = useNavigate()

  const current = provincialSeats.features.find((f) => f.properties.PA === seat)
  const currentStyle = current && polygonStyle(current)

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
        <div className="flex flex-col px-4 py-8 bg-green-50 items-center justify-center relative">
          <img className="w-20 h-20 rounded-md mb-5" src={PTIElectionSymbol} />
          <div className="font-mono font-bold text-emerald-600 mb-4">
            One-step tool to find the PTI Candidate in your constituency.
          </div>
          <button className="flex items-center bg-white shadow rounded-md px-3 py-1 select-none cursor-pointer font-bold text-red-600 font-mono tracking-tighter border border-transparent active:shadow-none active:border-gray-100 transition">
            <FaLocationCrosshairs className="mr-2 text-lg" />
            Find My Constituency
          </button>
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
        <div className="flex-1 w-full bg-red-50">
          {!(currentStyle && current) && (
            <div className="flex items-center justify-center w-full h-full">
              <img
                className="rounded-md mb-5"
                style={{
                  filter: 'grayscale(100%)',
                  opacity: 0.1,
                  width: 350,
                  height: 350
                }}
                src={PTIElectionSymbol}
              />
            </div>
          )}
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
