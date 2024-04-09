import { MapContainer, TileLayer, GeoJSON, Marker } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { stringToColor } from '../mapping/styles'
import { useEffect, useState } from 'react'
import React from 'react'
import Toggle from './components/Toggle'
import { Selected, useData } from '../hooks/useData'
import { SeatFeature } from '../hooks/useData/geojson'
import { divIcon } from 'leaflet'
import ReactDOMServer from 'react-dom/server'

const locationIcon = divIcon({
  html: ReactDOMServer.renderToString(
    <div className="w-full h-full bg-blue-600 rounded-full border-white border-4 animate-pulse shadow-md shadow-blue-500"></div>
  ),
  className: 'location-icon',
  iconSize: [25, 25] // size of the icon
})

const Map = ({
  selected,
  currentLocation
}: {
  selected: Selected
  currentLocation?: { latitude: number; longitude: number }
}) => {
  const navigate = useNavigate()
  const [data] = useData()

  const [selectedType, setSelectedType] = useState<'national' | 'provincial'>(
    'provincial'
  )

  const mapRef = React.useRef<any>(null)

  const isFeatureSelected = (feature: SeatFeature) => {
    return (
      feature.properties.CONSTITUENCY_CODE === selected?.national?.seat ||
      feature.properties.CONSTITUENCY_CODE === selected?.provincial?.seat
    )
  }

  const selectCurrentLayer = () => {
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

  // Attach event handlers to each feature
  const onEachFeature = (feature: SeatFeature, layer: any) => {
    layer.on({
      mouseover: (event: any) => {
        if (isFeatureSelected(feature)) return
        if (!data.seats[feature.properties.CONSTITUENCY_CODE]) return

        const layer = event.target
        layer.setStyle({
          fillOpacity: 0.9
        })
      },
      mouseout: (event: any) => {
        if (isFeatureSelected(feature)) return
        if (!data.seats[feature.properties.CONSTITUENCY_CODE]) return

        const layer = event.target
        layer.setStyle({
          fillOpacity: 0.6
        })
      },
      click: (event: any) => {
        if (!data.seats[feature.properties.CONSTITUENCY_CODE]) return

        navigate('/' + feature.properties.CONSTITUENCY_CODE)
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      if (selected.primary === false) {
        selectCurrentLayer()
      } else if (
        selected.primary === 'national' &&
        selectedType === 'national'
      ) {
        selectCurrentLayer()
      } else if (
        selected.primary === 'provincial' &&
        selectedType === 'provincial'
      ) {
        selectCurrentLayer()
      } else {
        setSelectedType((prevType) => {
          return prevType === 'national' ? 'provincial' : 'national'
        })
        setTimeout(() => {
          selectCurrentLayer()
        }, 0)
      }
    }, 0)
  }, [JSON.stringify(selected)])

  useEffect(() => {
    setTimeout(() => {
      selectCurrentLayer()
    }, 0)
  }, [selectedType])

  return (
    <div className="flex map w-1/2 h-full relative">
      <div className="absolute top-3 right-3" style={{ zIndex: 1000 }}>
        <Toggle
          type={selectedType}
          onChange={() => {
            const changeTo =
              selectedType === 'national' ? 'provincial' : 'national'
            if (selected.national && selected.provincial) {
              if (changeTo === 'national') {
                navigate(
                  '/' + selected.national.seat + '&' + selected.provincial.seat
                )
              } else {
                navigate(
                  '/' + selected.provincial.seat + '&' + selected.national.seat
                )
              }
            } else {
              setSelectedType(changeTo)
            }
          }}
        />
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
          key={selectedType}
          data={
            selectedType === 'national'
              ? data.geojson.national
              : data.geojson.provincial
          }
          style={(feature) => {
            const seatFeature = feature as SeatFeature

            const defaultStyle = {
              fillColor: stringToColor(
                seatFeature.properties.CONSTITUENCY_CODE
              ),
              weight: 1,
              opacity: 0.4,
              color: '#666666', // Border color
              fillOpacity: 0.4
            }

            if (!data.seats[seatFeature.properties.CONSTITUENCY_CODE]) {
              return {
                ...defaultStyle,
                fillOpacity: 0.15,
                opacity: 0.1,
                fillColor: '#d1d5db'
              }
            } else if (isFeatureSelected(seatFeature)) {
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
        {currentLocation && (
          <Marker
            icon={locationIcon}
            position={{
              lat: currentLocation?.latitude,
              lng: currentLocation?.longitude
            }}
          ></Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default Map
