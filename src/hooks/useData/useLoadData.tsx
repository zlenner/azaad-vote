import useAsyncRefresh from '../useAsyncRefresh'
import loadForm33, { Province } from './loadForm33'
import loadPTIData from './loadPTIData'
import { knownIssues, problematicSeats } from './issues'
import { Data } from '.'
import na_pa_mapping from './na_pa_mapping'
import geojson from './geojson'

export interface Candidate {
  serial_no: number
  candidate_english_name: string
  candidate_urdu_name: string
  address: string
  symbol_name: string
  party: string
  symbol_no: number
  symbol_url: string
  pti_backed: boolean
}

export interface Seat {
  type: 'national' | 'provincial'
  province: Province | ''
  seat: string
  form33_data?: {
    constituency_name: string
    returning_officer: string
    candidate_symbol_url?: string
    page_files: string[]
  }
  pti_data: {
    constituency_name: string
    whatsapp_link: string
    candidate_name: string
    candidate_symbol: {
      text: string
      url: string
      symbolfile: string
    }
  }
  candidates?: Candidate[]
}

export const useLoadData = () => {
  const { value: form33 } = useAsyncRefresh(loadForm33, [])
  const { value: pti_data } = useAsyncRefresh(loadPTIData, [])

  if (!form33 || !pti_data) {
    return undefined
  }

  const seats: {
    [key: string]: Seat
  } = {}

  for (const row of pti_data) {
    const form33Constituency = form33[row.Constituency]
    const pti_candidate_from_form_33 =
      form33Constituency &&
      form33Constituency.Candidates.find(
        (candidate) =>
          candidate['symbol_url'] ===
          'https://symbols.azaadvote.com/' + row.symbolfile + '.png'
      )

    seats[row.Constituency] = {
      type: row.type,
      province: row.Province || form33Constituency.province,
      seat: row.Constituency,
      form33_data: !form33Constituency
        ? undefined
        : {
            constituency_name: form33Constituency['Constituency Name'],
            returning_officer: form33Constituency['Returning Officer'],
            candidate_symbol_url:
              pti_candidate_from_form_33 &&
              pti_candidate_from_form_33.symbol_url,
            page_files: form33Constituency['PageFiles']
          },
      pti_data: {
        constituency_name: row.District,
        whatsapp_link: row['WhatsApp Link'],
        candidate_name: row.Candidate,
        candidate_symbol: {
          text: row['Symbol'],
          url: 'https://symbols.azaadvote.com/' + row['symbolfile'] + '.png',
          symbolfile: row['symbolfile']
        }
      },
      candidates: form33Constituency?.Candidates.map((candidate) => {
        let pti_backed =
          candidate.symbol_url ===
          'https://symbols.azaadvote.com/' + row.symbolfile + '.png'
        // SPECIAL CASES

        // Gohar Ali Khan NA-10 Buner
        if (
          row.Constituency === 'NA-10' &&
          candidate.symbol_url === 'https://symbols.azaadvote.com/teapot.png'
        ) {
          pti_backed = true
        }

        return {
          serial_no: candidate['SerialNo'],
          candidate_english_name: candidate['Name in English'],
          candidate_urdu_name: candidate['Name in Urdu'],
          symbol_name: candidate['Symbol'],
          party: candidate['Party'],
          symbol_url: candidate.symbol_url,
          symbol_no: candidate['SymbolNo'],
          address: candidate['Address'],
          pti_backed
        }
      })
    }
  }

  const data: Data = {
    seats,
    geojson,
    issues: {
      problematicSeats,
      knownIssues
    },
    na_pa_mapping
  }

  return data
}
