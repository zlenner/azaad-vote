import Papa from 'papaparse'
import { Province } from './loadForm33'

export interface RawPTIDataRow {
  Constituency: string
  District: string
  Candidate: string
  Symbol: string
  symbolfile: string
  'WhatsApp Link': string
  Province: Province | ''
  type: 'national' | 'provincial'
}

const loadPTIData = async () => {
  const [national, kpk, punjab, sindh, balochistan] = await Promise.all([
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
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3KERJcSeR44Le50BBC8lu9O-C2mU0PACCl9leUqba_NVKNhk5NNYKalpVNWkoWQ/pub?gid=1032451550&single=true&output=csv'
    ).then((r) => r.text())
  ])

  const formatCSV = (
    csvText: string,
    province: Province | '',
    type: 'national' | 'provincial'
  ) => {
    const parsedData = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    })

    const formatted: RawPTIDataRow[] = parsedData.data.map((row: any) => {
      return {
        Constituency: row.Constituency.trim(),
        District: row.District.trim(),
        Candidate: row.Candidate.trim(),
        Symbol: row.Symbol.trim(),
        symbolfile: row.symbolfile.trim(),
        'WhatsApp Link': row['WhatsApp Link'].trim(),
        Province: province,
        type: type
      }
    })

    return formatted
  }

  const formatted = [
    ...formatCSV(national, '', 'national'),
    ...formatCSV(kpk, 'kpk', 'provincial'),
    ...formatCSV(punjab, 'punjab', 'provincial'),
    ...formatCSV(sindh, 'sindh', 'provincial'),
    ...formatCSV(balochistan, 'balochistan', 'provincial')
  ]

  return formatted
}

export default loadPTIData
