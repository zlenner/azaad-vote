import { FaLocationCrosshairs, FaWhatsapp } from 'react-icons/fa6'
import CandidateView from '../CandidateView'
import { Seat } from '../../data'
import { MdHowToVote } from 'react-icons/md'
import SampleBallot from './SampleBallot'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm33 } from '../../../hooks/useForm33'

const ConstituencyView = ({
  selectedSeat,
  isMyDistrict
}: {
  selectedSeat: Seat
  isMyDistrict: boolean
}) => {
  const currentURL = useLocation()
  const isBallotOpen =
    currentURL.pathname.split('/').filter((el) => el !== '')[1] ===
    'ballot-paper'

  const navigate = useNavigate()

  const [form33] = useForm33()

  if (isBallotOpen) {
    return (
      <SampleBallot
        isOpen={isBallotOpen}
        closeModal={() => navigate(`/${selectedSeat.seat}`)}
        selectedSeat={selectedSeat}
      />
    )
  }

  return (
    <div className="flex w-full h-full relative">
      <div className="flex flex-col absolute right-4 top-4">
        {isMyDistrict && (
          <div className="flex font-mono tracking-tighter text-blue-600 px-3 py-2 bg-blue-50 font-bold rounded items-center mb-3">
            <FaLocationCrosshairs className="mr-3 text-lg" />
            Your District
          </div>
        )}
      </div>
      <div
        className="flex bg-emerald-500"
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
        <div className="flex flex-col absolute right-3 bottom-3 text-gray-700 font-semibold font-mono hidden md:flex">
          <div>
            {selectedSeat.type === 'national'
              ? 'NATIONAL'
              : selectedSeat.province.toUpperCase()}
          </div>
        </div>
        {selectedSeat.candidate && (
          <CandidateView candidate={selectedSeat.candidate} />
        )}
        <div className="flex mt-auto">
          {form33[selectedSeat.seat] && (
            <button
              className="flex w-fit items-center bg-white shadow rounded-md px-3 py-2 select-none cursor-pointer font-bold text-purple-500 font-mono tracking-tighter border border-transparent active:shadow-none active:border-gray-100 transition cursor-pointer z-50"
              onClick={() => navigate(`/${selectedSeat.seat}/ballot-paper`)}
            >
              <MdHowToVote className="mr-3 text-2xl" />
              Sample Ballot
            </button>
          )}
          <a href={selectedSeat.candidate?.whatsapp_link} target="_blank">
            <button className="flex w-fit items-center bg-white shadow rounded-md px-3 py-2 select-none cursor-pointer font-bold text-green-600 font-mono tracking-tighter border border-transparent active:shadow-none active:border-gray-100 transition cursor-pointer z-50 ml-3">
              <FaWhatsapp className="mr-3 text-2xl" />
              WhatsApp Channel
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ConstituencyView
