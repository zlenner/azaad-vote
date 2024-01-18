import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { polygonStyle } from '../mapping/styles'
import { useNavigate } from 'react-router-dom'
import provincialSeatsGeoJson from '../geojson/provincial.json'
import { ProvincialGeoJson } from '../models'

const provincialSeats = provincialSeatsGeoJson as ProvincialGeoJson

const Map = () => {
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
    <div className="flex flex-1 h-full">
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
  )
}

export default Map
