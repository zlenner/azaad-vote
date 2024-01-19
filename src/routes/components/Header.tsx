import { FaLocationCrosshairs } from 'react-icons/fa6'
import PTIElectionSymbol from '../../assets/nobg.png'
import { useState } from 'react'

const Header = ({
  goToMyConstituency
}: {
  goToMyConstituency: (coords: { latitude: number; longitude: number }) => void
}) => {
  const [loading, setLoading] = useState(false)

  const updateLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser')
    } else {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false)
          goToMyConstituency({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        () => {
          setLoading(false)
          console.error('Unable to retrieve your location')
        }
      )
    }
  }
  return (
    <div className="flex flex-col px-4 py-8 bg-green-50 items-center justify-center relative">
      <img className="w-20 h-20 rounded-md mb-5" src={PTIElectionSymbol} />
      <div className="font-mono font-bold text-emerald-600 mb-4">
        One-step tool to find the PTI Candidate in your district.
      </div>
      <button
        onClick={updateLocation}
        className="flex items-center bg-white shadow rounded-md px-3 py-1 select-none cursor-pointer font-bold text-red-600 font-mono tracking-tighter border border-transparent active:shadow-none active:border-gray-100 transition"
      >
        {loading ? (
          <div
            className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2.5"
            role="status"
          ></div>
        ) : (
          <FaLocationCrosshairs className="mr-2 text-lg" />
        )}
        Find District by Location
      </button>
    </div>
  )
}

export default Header
