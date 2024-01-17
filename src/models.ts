export interface ProvincialFeature {
  type: 'Feature'
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  properties: {
    OBJECTID: number
    PROVINCE: string
    DISTRICT: string
    PA: string
  }
}

export interface ProvincialGeoJson {
  features: ProvincialFeature[]
}
