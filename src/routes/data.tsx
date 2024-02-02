import national from '../data/national.json'
import balochistan from '../data/balochistan.json'
import sindh from '../data/sindh.json'
import punjab from '../data/punjab.json'
import kpk from '../data/kpk.json'

import districtsGeoJson from '../data/geojson/districts.json'

type Province = 'balochistan' | 'sindh' | 'punjab' | 'kpk'

export interface Candidate {
  constituency_name: string
  candidate_name: string
  whatsapp_link: string
  symbol?: {
    symbol_text: string
    symbol_image: string
  }
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

export interface AssemblyObject {
  Constituency: string
  District: string
  Candidate: string
  Symbol: string
  symbolfile: string
  'WhatsApp Link': string
}

export interface Seat {
  type: 'provincial' | 'national'
  province: Province | ''
  seat: string
  district: string
  candidate?: Candidate
}

export interface Form33Candidate {
  SerialNo: number
  'Name in English': string
  'Name in Urdu': string
  Address: string
  Symbol: string
  Party: string
  symbol_url: string
  SymbolNo: number | ''
  pti_backed?: {
    whatsapp_channel: string
  }
}

const produceData = () => {
  const RAW = {
    geojson: {
      districts: districtsGeoJson as {
        type: 'FeatureCollection'
        features: DistrictFeature[]
      }
    },
    national: national as AssemblyObject[],
    balochistan: balochistan as AssemblyObject[],
    sindh: sindh as AssemblyObject[],
    punjab: punjab as AssemblyObject[],
    kpk: kpk as AssemblyObject[]
  }

  const seats: Record<string, Seat> = {}

  const pushAssemblyObjectsToSeat = (
    type: 'provincial' | 'national',
    province: Province | '',
    assemblyObjects: AssemblyObject[]
  ) => {
    for (const seat of assemblyObjects) {
      seats[seat.Constituency] = {
        seat: seat.Constituency,
        type,
        province,
        district: '',
        candidate: {
          constituency_name: seat.District,
          candidate_name: seat.Candidate,
          whatsapp_link: seat['WhatsApp Link'],
          symbol: {
            symbol_text: seat.Symbol,
            symbol_image:
              'https://symbols.azaadvote.com/' + seat.symbolfile + '.png'
          }
        }
      }
    }
  }

  pushAssemblyObjectsToSeat('national', '', RAW.national)
  pushAssemblyObjectsToSeat('provincial', 'balochistan', RAW.balochistan)
  pushAssemblyObjectsToSeat('provincial', 'sindh', RAW.sindh)
  pushAssemblyObjectsToSeat('provincial', 'punjab', RAW.punjab)
  pushAssemblyObjectsToSeat('provincial', 'kpk', RAW.kpk)

  return {
    geojson: RAW.geojson,
    seats
  }
}

const { geojson, seats } = produceData()

export { geojson, seats }

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

export const problematicSeats = [
  'NA-251',
  'NA-256',
  'NA-258',
  'NA-259',
  'NA-261',
  'NA-266',
  'NA-190',
  'NA-191',
  'NA-192',
  'NA-195',
  'NA-199',
  'NA-194',
  'NA-196',
  'NA-197',
  'NA-249',
  'NA-62',
  'NA-64',
  'NA-65',
  'NA-72',
  'NA-94',
  'NA-144',
  'NA-162',
  'NA-163',
  'NA-176',
  'NA-181'
]

export const knownIssues = ['NA-127']
