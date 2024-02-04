import Papa from 'papaparse'
import { Province } from './loadForm33'

export interface Candidate {
  constituency_name: string
  candidate_name: string
  whatsapp_link: string
  symbol?: {
    symbol_text: string
    symbol_image: string
  }
}

export interface Seat {
  type: 'provincial' | 'national'
  province: Province | ''
  seat: string
  district: string
  candidate?: Candidate
}

export interface AssemblyObject {
  Constituency: string
  District: string
  Candidate: string
  Symbol: string
  symbolfile: string
  'WhatsApp Link': string
}

const parseMappingCSV = (csvText: string) => {
  // Parse the CSV with PapaParse
  const parsedData = Papa.parse(csvText, {
    header: false, // Adjust this if your CSV has a header row
    skipEmptyLines: true // Skips empty lines to avoid unnecessary processing
  })

  const mappingJSON: {
    [key: string]: string[]
  } = {}
  let currentKey = ''

  // Iterate over each row in the parsed data
  ;(parsedData.data as string[]).forEach((row) => {
    const key = row[0]?.trim() // Assuming keys are in the second column
    const value = row[1]?.trim() // Assuming values are in the third column

    // If a new key is found
    if (key && key !== '') {
      // Start a new array for this key
      currentKey = key
      mappingJSON[currentKey] = []
    }

    // Add the value to the current key's array, if applicable
    if (value && value !== '' && currentKey) {
      mappingJSON[currentKey].push(value)
    }
  })

  return mappingJSON
}

const loadPTIData = async () => {
  const [national, kpk, punjab, sindh, balochistan, mappingCSV] =
    await Promise.all([
      fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3KERJcSeR44Le50BBC8lu9O-C2mU0PACCl9leUqba_NVKNhk5NNYKalpVNWkoWQ/pub?gid=285854974&single=true&output=csv'
      ).then((r) => r.text()),
      fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3KERJcSeR44Le50BBC8lu9O-C2mU0PACCl9leUqba_NVKNhk5NNYKalpVNWkoWQ/pub?gid=300989700&single=true&output=csv'
      ).then((r) => r.text()),
      fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3KERJcSeR44Le50BBC8lu9O-C2mU0PACCl9leUqba_NVKNhk5NNYKalpVNWkoWQ/pub?gid=472420017&single=true&output=csv'
      ).then((r) => r.text()),
      fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3KERJcSeR44Le50BBC8lu9O-C2mU0PACCl9leUqba_NVKNhk5NNYKalpVNWkoWQ/pub?gid=924832023&single=true&output=csv'
      ).then((r) => r.text()),
      fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3KERJcSeR44Le50BBC8lu9O-C2mU0PACCl9leUqba_NVKNhk5NNYKalpVNWkoWQ/pub?gid=924832023&single=true&output=csv'
      ).then((r) => r.text()),
      fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3KERJcSeR44Le50BBC8lu9O-C2mU0PACCl9leUqba_NVKNhk5NNYKalpVNWkoWQ/pub?gid=276582531&single=true&output=csv'
      ).then((r) => r.text())
    ])

  parseMappingCSV(mappingCSV)

  const seats: Record<string, Seat> = {}

  const addProvinceToSeats = (
    csvText: string,
    province: Province | '',
    type: 'national' | 'provincial'
  ) => {
    const parsedData = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    })

    const json: AssemblyObject[] = parsedData.data.map((row: any) => {
      return {
        Constituency: row.Constituency.trim(),
        District: row.District.trim(),
        Candidate: row.Candidate.trim(),
        Symbol: row.Symbol.trim(),
        symbolfile: row.symbolfile.trim(),
        'WhatsApp Link': row['WhatsApp Link'].trim()
      }
    })

    for (const seat of json) {
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

  addProvinceToSeats(national, '', 'national')
  addProvinceToSeats(kpk, 'kpk', 'provincial')
  addProvinceToSeats(punjab, 'punjab', 'provincial')
  addProvinceToSeats(sindh, 'sindh', 'provincial')
  addProvinceToSeats(balochistan, 'balochistan', 'provincial')

  return seats
}

export default loadPTIData
