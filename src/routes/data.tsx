import provincialSeatsGeoJson from '../geojson/provincial.json'
import nationalSeatsGeoJson from '../geojson/national.json'

import candidatesJson from '../geojson/candidates.json'

export interface Candidate {
  constituency_name: string
  candidate_name: string
  symbol?: {
    symbol_text: string
    symbol_image: string
  }
}

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

export interface NationalAssemblyObject {
  Constituency: string
  District: string
  Candidate: string
  Symbol: string
  symbolfile: string
  Status: string
  duespaid: string
  'WhatsApp Link': string
}

export interface Seat {
  type: 'provincial' | 'national'
  province: string
  seat: string
  district: string
  candidate?: Candidate
}

const produceData = () => {
  const RAW = {
    provincialSeats: provincialSeatsGeoJson as {
      features: ProvincialFeature[]
    },
    nationalSeats: nationalSeatsGeoJson as NationalAssemblyObject[],
    candidates: candidatesJson as {
      [seat: string]: {
        constituency: string
        candidate: string
      }
    }
  }

  const seats: {
    [seat: string]: Seat
  } = Object.fromEntries(
    RAW.provincialSeats.features.map((feature) => {
      const candidate = RAW.candidates[feature.properties.PA]
      const key = feature.properties.PA
      const value = {
        type: 'provincial' as const,
        province: feature.properties.PROVINCE,
        seat: feature.properties.PA,
        district: feature.properties.DISTRICT,
        candidate: !candidate
          ? undefined
          : {
              constituency_name: candidate.constituency,
              candidate_name: candidate.candidate
            }
      }
      return [key, value]
    })
  )

  for (const seat of RAW.nationalSeats) {
    seats[seat.Constituency] = {
      seat: seat.Constituency,
      type: 'national',
      province: '',
      district: '',
      candidate: {
        constituency_name: seat.District,
        candidate_name: seat.Candidate,
        symbol: {
          symbol_text: seat.Symbol,
          symbol_image: '/symbols/' + seat.symbolfile + '.jpg'
        }
      }
    }
  }

  const provincialGeoJson = RAW.provincialSeats as {
    type: 'FeatureCollection'
    features: ProvincialFeature[]
  }

  return {
    provincialGeoJson,
    seats
  }
}

const { provincialGeoJson, seats } = produceData()

export { provincialGeoJson, seats }
