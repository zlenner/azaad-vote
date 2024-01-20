import PTIElectionSymbol from '../../assets/nobg.png'
import FindLocation from './FindLocation'

const Header = ({
  goToMyConstituency
}: {
  goToMyConstituency: (coords: { latitude: number; longitude: number }) => void
}) => {
  return (
    <div className="flex flex-col px-4 py-4 bg-green-50 items-center justify-center relative">
      <img className="w-20 h-20 rounded-md mb-5" src={PTIElectionSymbol} />
      <div className="font-mono font-bold text-emerald-600 mb-6">
        One-step tool to find the PTI Candidate in your constituency.
      </div>
      <div className="flex w-full">
        <input
          placeholder="Search Constituency"
          className="flex flex-1 bg-white !ring-0	!shadow !shadow-gray-200 rounded-md px-3 py-1 font-bold text-red-600 font-mono tracking-tighter !border !border-transparent active:shadow-none active:border-gray-100 transition mr-3"
        ></input>
        <FindLocation goToMyConstituency={goToMyConstituency} />
      </div>
    </div>
  )
}

export default Header
