import { Seat, form33 } from '../../data'
import Modal from 'react-modal'
import QRCode from 'qrcode'
import useAsyncRefresh from '../../../hooks/useAsyncRefresh'
import { useRef } from 'react'
import Stamp from './Stamp'
import clsx from 'clsx'
import { FaInfoCircle } from 'react-icons/fa'

const SampleBallot = ({
  selectedSeat,
  isOpen,
  closeModal
}: {
  selectedSeat: Seat
  isOpen: boolean
  closeModal: () => void
}) => {
  const ballotPaperRef = useRef<HTMLDivElement>(null)

  const constituency = form33[selectedSeat.seat]
  const reordered: {
    symbol_url: string
    candidate_name: string
    pti_backed: boolean
  }[] = []

  const noRows = Math.ceil(constituency.candidates.length / 3)

  for (let i = 0; i < noRows; i += 1) {
    // Section 1
    for (let j = i; j < constituency.candidates.length; j += noRows) {
      reordered.push(constituency.candidates[j])
    }
  }

  const { value: QRCodeURL } = useAsyncRefresh(() => {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(
        `https://azaadvote.com/${selectedSeat.seat}/ballot-paper`,
        function (err, url) {
          resolve(url)
        }
      )
    })
  }, [selectedSeat.seat])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Sample Ballot Paper"
      style={{
        overlay: {
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        content: {
          position: 'static',
          display: 'flex',
          flexDirection: 'column',
          width: 560,
          padding: 0,
          borderRadius: 0,
          maxHeight: '90vh'
        }
      }}
    >
      <div className="whitespace-break-spaces bg-red-50 text-xs p-4 text-red-500 font-mono mb-2">
        Some mistakes were pointed out by users, double-check the data for your
        constituency with the official{' '}
        <a
          href="https://insafpk.github.io/pticandidates/"
          className="text-blue-500 hover:underline"
        >
          PTI portal
        </a>
        . Will update{' '}
        <a
          className="text-blue-500 hover:underline"
          href="https://twitter.com/clynergy"
        >
          @clynergy
        </a>{' '}
        as soon as they're fixed!
      </div>
      <div
        className="flex flex-col px-3 py-3 mx-2 mb-2"
        style={{
          border: '5px solid #ef4444',
          borderStyle: 'dashed'
        }}
        ref={ballotPaperRef}
      >
        <div className="flex font-mono font-bold text-xl mb-4 tracking-tighter px-4 pt-2 pb-4">
          <div>Sample Ballot Paper</div>
          <div className="ml-auto text-right">سیمپل بیلٹ پیپر</div>
        </div>
        <div
          className="grid grid-cols-3 auto-rows-max w-full h-full gap-1 "
          dir="rtl"
        >
          {reordered.map((candidate) => {
            return (
              <div
                key={candidate.symbol_url}
                className={clsx(
                  'relative text-sm md:text-lg px-3 py-2 flex items-center w-full border border-black',
                  candidate.pti_backed && '!border-4 border-red-500 '
                )}
                style={{ borderWidth: '0.5px' }}
              >
                <div className="ml-auto font-urdu">
                  {candidate.candidate_name}
                </div>
                <img
                  className="w-6 h-6 md:w-12 md:h-12 mr-2 bg-gray-100"
                  src={candidate.symbol_url}
                />
                {candidate.pti_backed && <Stamp />}
              </div>
            )
          })}
        </div>
        <div className="flex pt-3 mt-1 items-center border-dashed">
          <div className="font-mono tracking-tight">
            https://azaadvote.com/{selectedSeat.seat}/ballot-paper
          </div>
          <img
            className="ml-auto"
            src={QRCodeURL}
            style={{ width: '3em', height: '3em' }}
          />
        </div>
      </div>
      {/* <button
        className="flex mt-auto ml-auto mb-1 w-fit items-center bg-white shadow rounded-md px-3 py-2 select-none cursor-pointer font-bold font-mono tracking-tighter border border-transparent active:shadow-none active:border-gray-100 transition cursor-pointer z-50 ml-3 text-red-500"
        onClick={async () => {
          if (!ballotPaperRef.current) return
          const canvas = await html2canvas(ballotPaperRef.current, {
            allowTaint: true,
            foreignObjectRendering: true
          })
          const dataURL = canvas.toDataURL('image/png')
          downloadjs(dataURL, 'download.png', 'image/png')
        }}
      >
        <FaImage className="mr-3 text-2xl" />
        Download Image
      </button> */}
    </Modal>
  )
}

export default SampleBallot
