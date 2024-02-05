import { Candidate, Seat } from '../../hooks/useData/useLoadData'

const SeatCandidateView = ({ seat }: { seat: Seat }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-8">
        <div className="font-mono font-bold text-3xl mb-3 text-emerald-500">
          Candidate
        </div>
        <div className="flex ml-5 text-gray-600 font-mono text-3xl">
          {seat.pti_data.candidate_name}
        </div>
      </div>
      {seat.pti_data.candidate_symbol.symbolfile && (
        <div className="flex flex-col">
          <div className="font-mono font-bold text-3xl mb-4 text-emerald-500">
            Symbol
          </div>
          <div className="flex flex-col ml-5 text-gray-600 font-mono mb-2 text-3xl justify-center">
            <div className="mb-2">{seat.pti_data.candidate_symbol.text}</div>
            <div className="flex text-gray-600 font-mono">
              {seat.pti_data.candidate_symbol.symbolfile ? (
                <img
                  style={{ height: '100px', width: '100px' }}
                  src={seat.pti_data.candidate_symbol.url}
                ></img>
              ) : seat.form33_data?.candidate_symbol_url ? (
                <div>
                  <img
                    style={{ height: '100px', width: '100px' }}
                    src={seat.form33_data.candidate_symbol_url}
                  ></img>
                  <div className="text-xs mt-4">
                    <a
                      href={'https://pticandidates.com/'}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      pticandidates.com
                    </a>{' '}
                    does not list a symbol for this constituency, this symbol is
                    from the sample ballot paper and is accurate.
                  </div>
                </div>
              ) : (
                <div className="text-xs">
                  <a
                    href={'https://pticandidates.com/'}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    pticandidates.com
                  </a>{' '}
                  does not list a symbol for this constituency.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeatCandidateView
