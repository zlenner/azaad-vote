import createStateContext from 'react-use/lib/factory/createStateContext'
import useAsyncRefresh from '../useAsyncRefresh'
import geojson, { GeoJsonData } from './geojson'
import loadForm33 from './loadForm33'
import loadPTIData, { Seat } from './loadPTIData'
import { knownIssues, problematicSeats } from './issues'

export interface ProcessedForm33 {
  [key: string]: {
    constituency_no: string
    constituency_name: string
    candidates: {
      symbol_url: string
      candidate_name: string
      pti_backed: boolean
    }[]
  }
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

interface Data {
  form33: ProcessedForm33
  seats: Record<string, Seat>
  geojson: GeoJsonData
  issues: {
    problematicSeats: string[]
    knownIssues: string[]
  }
}

const [useSharedState, SharedStateProvider] = createStateContext<Data>(
  undefined as any
)

export const useLoadData = () => {
  const { value: form33 } = useAsyncRefresh(loadForm33, [])
  const { value: pti_data } = useAsyncRefresh(loadPTIData, [])

  if (!form33 || !pti_data) {
    return undefined
  }

  const data: Data = {
    form33,
    seats: pti_data,
    geojson,
    issues: {
      problematicSeats,
      knownIssues
    }
  }

  return data
}

export const DataProvider = SharedStateProvider
export const useData = useSharedState
