import { FaLocationCrosshairs } from 'react-icons/fa6'
import PTIElectionSymbol from '../../assets/nobg.png'

const Header = ({ goToMyConstituency }: { goToMyConstituency: () => void }) => {
  return (
    <div className="flex flex-col px-4 py-8 bg-green-50 items-center justify-center relative">
      <img className="w-20 h-20 rounded-md mb-5" src={PTIElectionSymbol} />
      <div className="font-mono font-bold text-emerald-600 mb-4">
        One-step tool to find the PTI Candidate in your constituency.
      </div>
      <button
        onClick={goToMyConstituency}
        className="flex items-center bg-white shadow rounded-md px-3 py-1 select-none cursor-pointer font-bold text-red-600 font-mono tracking-tighter border border-transparent active:shadow-none active:border-gray-100 transition"
      >
        <FaLocationCrosshairs className="mr-2 text-lg" />
        Find My Constituency
      </button>
    </div>
  )
}

export default Header
