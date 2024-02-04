import nationalGeoJson from '../../data/geojson/national.json'
import provincialGeoJson from '../../data/geojson/provincial.json'

export interface Feature {
  type: 'Feature'
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  properties: any
}

export interface SeatFeature extends Feature {
  properties: {
    COUNTRY: 'Pakistan'
    PROVINCE: string
    latitude: string
    longitude: string
    CONSTITUENCY_CODE: string
    CONSTITUENCY_NAME: string
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

const formatGeoJson = (features: Feature[]) => {
  return features
    .filter(
      (feature) =>
        !['Gilgit-Baltistan', 'AJ & K'].includes(feature.properties.PROVINCE)
    )
    .map((feature) => {
      const [CONSTITUENCY_CODE, CONSTITUENCY_NAME] =
        feature.properties.CONSTITUENCY.split(' ', 2)
      return {
        ...feature,
        properties: {
          COUNTRY: feature.properties.COUNTRY,
          PROVINCE: feature.properties.PROVINCE,
          latitude: feature.properties.latitude,
          longitude: feature.properties.longitude,
          CONSTITUENCY_NAME: CONSTITUENCY_NAME,
          CONSTITUENCY_CODE: CONSTITUENCY_CODE,
          DISTRICT: feature.properties.DISTRICT,
          DISTRICT_ALT_NAME: feature.properties.DISTRICT_ALT_NAME
        }
      } as SeatFeature
    })
}

const geojson = {
  national: {
    type: 'FeatureCollection',
    features: formatGeoJson(nationalGeoJson.features as Feature[])
  },
  provincial: {
    type: 'FeatureCollection',
    features: formatGeoJson(provincialGeoJson.features as Feature[])
  }
} as GeoJsonData

export default geojson
