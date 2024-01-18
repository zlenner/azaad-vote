import { FaLocationCrosshairs } from 'react-icons/fa6'
import { Candidate, ProvincialFeature } from '../../models'
import CandidateView from './CandidateView'

const ConstituencyView = ({
  feature,
  color,
  candidate
}: {
  feature: ProvincialFeature
  color: string
  candidate?: Candidate
}) => {
  return (
    <div className="flex w-full relative">
      <div className="flex absolute font-mono bg-blue-50 text-blue-600 font-bold items-center px-3 py-2 rounded right-4 top-4 tracking-tighter">
        <FaLocationCrosshairs className="mr-3 text-lg" />
        Your Constituency
      </div>
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
