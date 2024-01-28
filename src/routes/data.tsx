import national from '../data/national.json'
import balochistan from '../data/balochistan.json'
import sindh from '../data/sindh.json'
import punjab from '../data/punjab.json'
import kpk from '../data/kpk.json'

import districtsGeoJson from '../data/geojson/districts.json'

import candidatesNationalJson from '../data/candidates/national.json'

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
    candidatesNationalJson: candidatesNationalJson as {
      [constituency: string]: {
        'Constituency No': string
        'Constituency Name': string
        'Returning Officer': string
        NumPages: number
        PageFiles: string[]
        Candidates: Form33Candidate[]
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
              'https://symbols.azaadvote.com/' + seat.symbolfile + '.jpg'
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

  const form33 = Object.fromEntries(
    Object.entries(RAW.candidatesNationalJson).map(
      ([constituency_no, constituency]) => {
        const candidates = constituency.Candidates.map((candidate) => {
          return {
            symbol_url: candidate.symbol_url,
            candidate_name: candidate['Name in Urdu'],
            pti_backed: !!candidate.pti_backed
          }
        })

        return [
          constituency_no,
          {
            constituency_no,
            constituency_name: constituency['Constituency Name'],
            candidates
          }
        ]
      }
    )
  )

  return {
    geojson: RAW.geojson,
    form33,
    seats
  }
}

const { geojson, seats, form33 } = produceData()

export { geojson, seats, form33 }

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
