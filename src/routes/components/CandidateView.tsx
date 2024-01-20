import { Candidate } from '../data'

const CandidateView = ({
  color,
  candidate
}: {
  color: string
  candidate: Candidate
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-6">
        <div
          className="font-mono font-bold text-3xl mb-3"
          style={{ color: color }}
        >
          Candidate
        </div>
        <div className="flex ml-5 text-gray-600 font-mono text-3xl">
          {candidate.candidate_name}
        </div>
      </div>
      {candidate.symbol_text && (
        <div className="flex flex-col">
          <div
            className="font-mono font-bold text-3xl mb-3"
            style={{ color: color }}
          >
            Symbol
          </div>
          <div className="flex ml-5 text-gray-600 font-mono mb-2 text-3xl justify-center">
            {candidate.symbol_text}
            <div className="ml-4 text-gray-600 font-mono">
              <img
                style={{ height: '35px', width: '35px' }}
                src={candidate.symbol_image}
              ></img>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateView
