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
      <div className="flex flex-col mb-8">
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
      {candidate.symbol && (
        <div className="flex flex-col">
          <div
            className="font-mono font-bold text-3xl mb-4"
            style={{ color: color }}
          >
            Symbol
          </div>
          <div className="flex flex-col ml-5 text-gray-600 font-mono mb-2 text-3xl justify-center">
            <div className="mb-2">{candidate.symbol.symbol_text}</div>
            <div className="flex text-gray-600 font-mono">
              <img
                style={{ height: '100px', width: '100px' }}
                src={candidate.symbol.symbol_image}
              ></img>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateView
