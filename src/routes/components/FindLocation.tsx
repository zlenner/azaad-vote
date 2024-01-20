import { useState } from 'react'
import { FaLocationCrosshairs } from 'react-icons/fa6'

const FindLocation = ({
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
      Locate
    </button>
  )
}

export default FindLocation
