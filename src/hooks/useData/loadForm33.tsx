export type Province = 'balochistan' | 'sindh' | 'punjab' | 'kpk'

interface Form33Candidate {
  SerialNo: number
  'Name in English': string
  'Name in Urdu': string
  Address: string
  Symbol: string
  Party: string
  symbol_url: string
  SymbolNo: number
}

interface Form33Constituency {
  'Constituency No': string
  'Constituency Name': string
  'Returning Officer': string
  NumPages: number
  PageFiles: string[]
  Candidates: Form33Candidate[]
  province: Province
}

function AddProvinceName(province: string, type: 'national' | 'provincial') {
  return (data: any) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        {
          ...(value as any),
          province: province
        }
      ])
    )
  }
}

const form33 = async function () {
  const [balochistan, kpk, punjab, sindh] = await Promise.all([
    fetch('https://elections-data.vercel.app/NA/balochistan.json')
      .then((r) => r.json())
      .then(AddProvinceName('balochistan', 'national')),
    fetch('https://elections-data.vercel.app/NA/kpk.json')
      .then((r) => r.json())
      .then(AddProvinceName('kpk', 'national')),
    fetch('https://elections-data.vercel.app/NA/punjab.json')
      .then((r) => r.json())
      .then(AddProvinceName('punjab', 'national')),
    fetch('https://elections-data.vercel.app/NA/sindh.json')
      .then((r) => r.json())
      .then(AddProvinceName('sindh', 'national'))
  ])

  const combinedForm33Data = {
    ...balochistan,
    ...kpk,
    ...punjab,
    ...sindh
  } as {
    [key: string]: Form33Constituency
  }

  return combinedForm33Data
}

export default form33
