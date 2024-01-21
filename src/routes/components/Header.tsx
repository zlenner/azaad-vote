import { Popover } from 'react-tiny-popover'
import PTIElectionSymbol from '../../assets/nobg.png'
import FindLocation from './FindLocation'
import { useRef, useState } from 'react'
import SearchConstituency from './SearchConstituency'

const Header = ({
  goToMyConstituency
}: {
  goToMyConstituency: (coords: { latitude: number; longitude: number }) => void
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <div className="flex flex-col px-4 py-4 bg-green-50 items-center justify-center relative">
      <img className="w-20 h-20 rounded-md mb-5" src={PTIElectionSymbol} />
      <div className="font-mono font-bold text-emerald-600 mb-6">
        One-step tool to find the PTI Candidate in your constituency.
      </div>
      <div className="flex w-full">
        <SearchConstituency />
        <FindLocation goToMyConstituency={goToMyConstituency} />
      </div>
    </div>
  )
}

export default Header
