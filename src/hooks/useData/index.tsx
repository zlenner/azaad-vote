import createStateContext from 'react-use/lib/factory/createStateContext'
import useAsyncRefresh from '../useAsyncRefresh'
import geojson, { GeoJsonData } from './geojson'
import loadForm33, { ProcessedForm33 } from './loadForm33'
import loadPTIData, { Seat } from './loadPTIData'
import { knownIssues, problematicSeats } from './issues'

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
  const { value: form33WithoutPTIData } = useAsyncRefresh(loadForm33, [])
  const { value: pti_data } = useAsyncRefresh(loadPTIData, [])

  if (!form33WithoutPTIData || !pti_data) {
    return undefined
  }

  const form33 = Object.fromEntries(
    Object.entries(form33WithoutPTIData).map(
      ([constituency_code, constituency]) => {
        const ptiDataCandidate = pti_data[constituency_code].candidate
        let pti_backed_any = false
        const updated_constituency_entries = [
          constituency_code,
          {
            ...constituency,
            candidates: constituency.candidates.map((form33Candidate) => {
              const isGohar =
                constituency_code === 'NA-10' &&
                form33Candidate.symbol_url ===
                  'https://symbols.azaadvote.com/teapot.png'

              const isPTIBacked =
                ptiDataCandidate?.symbol?.symbol_image ===
                  form33Candidate.symbol_url || isGohar

              if (isPTIBacked) {
                pti_backed_any = true
              }

              return {
                ...form33Candidate,
                pti_backed: isPTIBacked
              }
            })
          }
        ]
        if (pti_backed_any && problematicSeats.includes(constituency_code)) {
          console.log('Why is this problematic?', constituency_code)
        }

        if (!pti_backed_any && !problematicSeats.includes(constituency_code)) {
          console.log('PTI did not back any candidate in', constituency_code)
        }
        return updated_constituency_entries
      }
    )
  )

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
