import createStateContext from 'react-use/lib/factory/createStateContext'
import { GeoJsonData } from './geojson'
import { Seat } from './useLoadData'

export interface Data {
  seats: Record<string, Seat>
  geojson: GeoJsonData
  issues: {
    problematicSeats: string[]
    knownIssues: string[]
  }
  na_pa_mapping: {
    [key: string]: string[]
  }
}

const [useSharedState, SharedStateProvider] = createStateContext<Data>(
  undefined as any
)

export const DataProvider = SharedStateProvider
export const useData = useSharedState
