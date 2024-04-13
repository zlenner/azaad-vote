import Papa from 'papaparse'
import { Province } from './loadForm33'

export interface RawPTIDataRow {
  'Constituency No': string
  Location: string
  District: string
  'Candidate Name': string
  Symbol: string
  symbolfile: string
  'WhatsApp Channel Link': string
}

const loadPTIData = async () => {
  const [all] = await Promise.all([
    fetch(
      'https://docs.google.com/spreadsheets/d/1C1zVBpEtGRJHu5D_o_FAw781rcyqLw2C/export?format=csv'
    ).then((r) => r.text())
  ])

  const formatCSV = (csvText: string, province: Province | '') => {
    const parsedData = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    })

    const formatted: RawPTIDataRow[] = parsedData.data
      .map((row: any) => {
        return {
          'Constituency No': row['Constituency No']
            .trim()
            .replace(/([a-zA-Z]+)(\d+)/, '$1-$2'),
          Location: row.Location.trim(),
          District: row.District.trim(),
          'Candidate Name': row['Candidate Name'].trim(),
          Symbol: row.Symbol.trim(),
          symbolfile: row.symbolfile.trim(),
          'WhatsApp Channel Link': row['WhatsApp Channel Link'].trim()
        }
      })
      .filter((row: RawPTIDataRow) => {
        return row['Constituency No'] !== ''
      })

    return formatted
  }

  const formatted = [...formatCSV(all, '')]

  return formatted
}

export default loadPTIData
