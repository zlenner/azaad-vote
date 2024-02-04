import nationalGeoJson from '../../data/geojson/national.json'
import provincialGeoJson from '../../data/geojson/provincial.json'
import { Seat } from './loadPTIData'

export interface SeatFeature {
  type: 'Feature'
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  properties: {
    COUNTRY: 'Pakistan'
    PROVINCE: string
    latitude: string
    longitude: string
    CONSTITUENCY: string
    DISTRICT: string
    DISTRICT_ALT_NAME: string
  }
}

export type GeoJsonData = {
  national: {
    type: 'FeatureCollection'
    features: SeatFeature[]
  }
  provincial: {
    type: 'FeatureCollection'
    features: SeatFeature[]
  }
}

const geojson = {
  national: nationalGeoJson,
  provincial: provincialGeoJson
} as GeoJsonData

export default geojson
