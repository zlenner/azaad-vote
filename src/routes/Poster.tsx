import { Link, useParams } from 'react-router-dom'
import { useData } from '../hooks/useData'
import { useMemo, useRef } from 'react'
import clsx from 'clsx'
import html2canvas from 'html2canvas'
import download from 'downloadjs'

const Poster = () => {
  const { rows = '6' } = useParams()
  const [data] = useData()
  const ref = useRef<HTMLDivElement>(null)

  const rows_list = [3, 4, 5, 6, 8]

  const numRows = useMemo(() => {
    try {
      return parseInt(rows)
    } catch (error) {
      return null
    }
  }, [rows])

  if (numRows === null) {
    return <div>Invalid no. of cols</div>
  }

  const downloadPoster = async () => {
    if (!ref.current) return

    try {
      const canvas = await html2canvas(ref.current, {
        useCORS: true,
        allowTaint: true
      })
      download(
        canvas.toDataURL('image/png'),
        'bye_elections_april_2024_poster.png'
      )
    } catch (e) {
      console.error(e)
    }
  }

  const filtered = useMemo(() => {
    return Object.values(data.seats).filter(
      (seat) => seat.pti_data.candidate_symbol.symbolfile
    )
  }, [])

  const x = [
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'grid-cols-7',
    'grid-cols-8',
    'grid-cols-9',
    'grid-cols-10',
    'grid-cols-11',
    'grid-cols-12'
  ]

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex uppercase py-2 font-bold font-mono px-4 items-center">
        <Link className="lowercase" to="/">
          azaadvote
        </Link>
        <div className="flex items-center ml-auto mr-4">
          <div className="mr-3">COLUMNS</div>
          <div className="bg-black text-white px-2 py-1 mx-1">{numRows}</div>
          {rows_list
            .filter((n) => n !== numRows)
            .map((n) => (
              <Link
                key={n}
                to={`/poster/${n}`}
                className="hover:bg-gray-100 active:bg-gray-200 px-2 py-1 mx-1"
              >
                {n}
              </Link>
            ))}
        </div>
        <button
          className="px-2 active:bg-gray-100 py-1 border border-transparent hover:border-gray-500"
          onClick={downloadPoster}
        >
          Download
        </button>
      </div>
      <div className="flex flex-col " ref={ref}>
        <div
          className={clsx(`w-full grid auto flex-1`, 'grid-cols-' + numRows)}
        >
          {filtered.map((seat) => (
            <div
              key={seat.seat}
              className={clsx(
                'flex flex-col items-center px-2 py-2 border-2 border-gray-300 overflow-hidden',
                seat.type === 'national' ? 'bg-[#dce6e0]' : ''
              )}
            >
              <div className="text-center text-red-700 font-bold mb-1">
                {seat.seat} ({seat.pti_data.constituency_name})
              </div>
              <div className="text-center text-green-800 font-bold mb-1">
                {seat.pti_data.candidate_name
                  .toUpperCase()
                  .includes('TO BE UPLOADED')
                  ? 'NO CANDIDATE'
                  : seat.pti_data.candidate_name}
              </div>
              <div className="flex py-2 items-center">
                <div className="text-center font-urdu h-fit">
                  {seat.pti_data.candidate_symbol.text}
                </div>
                <img
                  crossOrigin="anonymous"
                  className="text-center ml-1"
                  width="90px"
                  height="90px"
                  src={seat.pti_data.candidate_symbol.url}
                  alt={seat.pti_data.candidate_symbol.text}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="font-mono px-auto w-full flex justify-center pb-4 mt-2">
          azaadvote.com/poster
        </div>
      </div>
    </div>
  )
}

export default Poster
