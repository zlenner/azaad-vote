import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { stringToColor } from '../mapping/styles'
import { useEffect } from 'react'
import React from 'react'
import { ProvincialFeature, Seat, provincialGeoJson, seats } from './data'

const Map = ({ selectedSeat }: { selectedSeat?: Seat }) => {
  const navigate = useNavigate()

  const isFeatureSelected = (feature: ProvincialFeature) => {
    return feature.properties.PA === selectedSeat?.seat
  }

  // Attach event handlers to each feature
  const onEachFeature = (feature: ProvincialFeature, layer: any) => {
    layer.on({
      mouseover: (event: any) => {
        if (isFeatureSelected(feature)) return

        const layer = event.target
        layer.setStyle({
          fillOpacity: 0.9
        })
      },
      mouseout: (event: any) => {
        if (isFeatureSelected(feature)) return

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

  const mapRef = React.useRef<any>(null)

  useEffect(() => {
    setTimeout(() => {
      if (!mapRef.current) {
        console.warn(
          "Couldn't zoom on selected constituency because map wasn't loaded as expected."
        )
      }
      // Zoom to the initial selected polygon, if provided
      if (selectedSeat && mapRef.current) {
        const selectedLayer = Object.values(mapRef.current._layers).find(
          (layer: any) => {
            if (layer.feature === undefined) {
              return false
            }
            return isFeatureSelected(layer.feature)
          }
        ) as any

        if (selectedLayer) {
          const bounds = selectedLayer.getBounds()
          mapRef.current.fitBounds(bounds)
        }
      }
    }, 0)
  }, [selectedSeat?.seat])

  return (
    <div className="flex flex-1 h-full map">
      <MapContainer
        className="w-full h-full"
        center={[30.656574684183685, 68.25139799853381]}
        zoom={6}
        scrollWheelZoom={true}
        attributionControl={false}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <GeoJSON
          data={provincialGeoJson}
          style={(feature) => {
            const seat = seats[feature!.properties.PA]

            const defaultStyle = {
              fillColor: stringToColor(seat.seat),
              weight: 1,
              opacity: 1,
              color: '#666666', // Border color
              fillOpacity: 0.5
            }

            if (isFeatureSelected(feature as ProvincialFeature)) {
              return {
                ...defaultStyle,
                fillColor: 'transparent',
                weight: 5
              }
            } else if (
              !seat.candidate ||
              seat.candidate.constituency_name.toUpperCase() === 'PENDING'
            ) {
              // In case the candidate is pending, we want to make the color lighter
              return {
                ...defaultStyle,
                fillColor: '#e5e7eb',
                opacity: 0.2
              }
            } else {
              return defaultStyle
            }
          }}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  )
}

export default Map
