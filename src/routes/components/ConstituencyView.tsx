import { FaLocationCrosshairs } from 'react-icons/fa6'
import { Candidate, ProvincialFeature } from '../../models'
import CandidateView from './CandidateView'

const ConstituencyView = ({
  feature,
  color,
  candidate,
  isMyConstituency
}: {
  feature: ProvincialFeature
  color: string
  candidate?: Candidate
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
        style={{
          height: '100%',
          width: '25px',
          backgroundColor: color
        }}
      ></div>
      <div className="flex flex-col w-full px-5 py-4 relative">
        <div className="flex flex-col w-full mb-8">
          <div
            className="font-bold font-mono text-7xl"
            style={{ color: color }}
          >
            {feature.properties.PA}
          </div>
          <div
            className="font-mono font-bold text-3xl"
            style={{ color: color }}
          >
            {feature.properties.DISTRICT}
          </div>
        </div>
        <div className="flex flex-col absolute right-3 bottom-3 text-gray-700 font-semibold font-mono">
          <div>{feature.properties.PROVINCE}</div>
        </div>
        {candidate && <CandidateView candidate={candidate} color={color} />}
      </div>
    </div>
  )
}

export default ConstituencyView
