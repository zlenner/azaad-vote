import districtsGeoJson from '../../data/geojson/districts.json'
import { Seat } from './loadPTIData'

export type Selected =
  | {
      type: 'district'
      color: string
      district: DistrictFeature
    }
  | {
      type: 'seat'
      seat: Seat
    }

export interface DistrictFeature {
  type: 'Feature'
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  properties: {
    PROVINCE_ID: 1
    PROVINCE: 'Azad Kashmir'
    CITY_ID: 1
    CITY: 'Azad Kashmir'
    DISTRICT_ID: 4
    DISTRICT: 'Mirpur'
    ALT_NAME: null
  }
}

export type GeoJsonData = {
  districts: {
    type: 'FeatureCollection'
    features: DistrictFeature[]
  }
}

const geojson = {
  districts: districtsGeoJson
} as GeoJsonData

export default geojson
