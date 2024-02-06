import { Link } from 'react-router-dom'

const Page404 = () => {
  return (
    <div className="flex flex-col text-gray-400 items-center">
      <div className="text-7xl mb-2">404</div>
      <div className="text-2xl mb-10">Page not found</div>
      <Link to="/" className="text-blue-500 cursor-pointer hover:underline">
        Back to Home
      </Link>
    </div>
  )
}

export default Page404
