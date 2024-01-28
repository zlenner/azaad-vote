import { FaLocationCrosshairs } from 'react-icons/fa6'
import CandidateView from './CandidateView'
import { Seat } from '../data'

const SelectionView = ({
  selectedSeat,
  isMyConstituency
}: {
  selectedSeat: Seat
  isMyConstituency: boolean
}) => {
  return (
    <div className="flex w-full relative">
      {isMyConstituency && (
        <div className="flex absolute right-4 top-4">
          <div className="flex font-mono tracking-tighter text-blue-600 px-3 py-2 bg-blue-50 font-bold rounded items-center">
            <FaLocationCrosshairs className="mr-3 text-lg" />
            Your Constituency
          </div>
        </div>
      )}
      <div
        className="bg-emerald-500"
        style={{
          height: '100%',
          width: '25px'
        }}
      ></div>
      <div className="flex flex-col w-full px-5 py-4 relative">
        <div className="flex flex-col w-full mb-8">
          <div className="font-bold font-mono text-7xl text-emerald-500">
            {selectedSeat.seat}
          </div>
          <div className="font-mono font-bold text-3xl text-emerald-500">
            {selectedSeat.candidate?.constituency_name}
          </div>
        </div>
        <div className="flex flex-col absolute right-3 bottom-3 text-gray-700 font-semibold font-mono">
          <div>
            {selectedSeat.type === 'national'
              ? 'NATIONAL'
              : selectedSeat.province}
          </div>
        </div>
        {selectedSeat.candidate && (
          <CandidateView candidate={selectedSeat.candidate} />
        )}
      </div>
    </div>
  )
}

export default SelectionView
