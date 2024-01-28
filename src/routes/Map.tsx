import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { stringToColor } from '../mapping/styles'
import { useEffect } from 'react'
import React from 'react'
import { DistrictFeature, geojson, seats } from './data'
import Toggle from './components/Toggle'

const Map = ({ selectedDistrict }: { selectedDistrict?: DistrictFeature }) => {
  const navigate = useNavigate()

  const isFeatureSelected = (feature: DistrictFeature) => {
    return (
      feature.properties.DISTRICT_ID ===
      selectedDistrict?.properties.DISTRICT_ID
    )
  }

  // Attach event handlers to each feature
  const onEachFeature = (feature: DistrictFeature, layer: any) => {
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
        const district = layer.feature as DistrictFeature
        navigate('/DISTRICT-' + district.properties.DISTRICT_ID)
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
      if (selectedDistrict && mapRef.current) {
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
  }, [selectedDistrict?.properties.DISTRICT_ID])

  return (
    <div className="flex flex-1 h-full map relative">
      <div className="absolute top-3 right-3" style={{ zIndex: 99999 }}>
        <Toggle assembly="provincial" onChange={() => {}} isDisabled />
      </div>
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
          data={geojson.districts}
          style={(feature) => {
            const district = feature as DistrictFeature

            const defaultStyle = {
              fillColor: stringToColor(
                district.properties.DISTRICT_ID.toString()
              ),
              weight: 1,
              opacity: 0.4,
              color: '#666666', // Border color
              fillOpacity: 0.5
            }

            if (isFeatureSelected(feature as DistrictFeature)) {
              return {
                ...defaultStyle,
                fillColor: 'transparent',
                weight: 5
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
