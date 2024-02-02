import { useForm33 } from '../../hooks/useForm33'
import { Candidate } from '../data'

const CandidateView = ({
  candidate,
  constituency_code
}: {
  candidate: Candidate
  constituency_code: string
}) => {
  const [form33] = useForm33()

  const pticandidates_com_symbol = candidate.symbol?.symbol_image.substring(
    30,
    candidate.symbol.symbol_image.length - 4
  )

  const pti_backed = form33[constituency_code].candidates.find(
    (candidate) => !!candidate.pti_backed
  )
  const pti_backed_symbol = pti_backed?.symbol_url.substring(
    30,
    pti_backed.symbol_url.length - 4
  )

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-8">
        <div className="font-mono font-bold text-3xl mb-3 text-emerald-500">
          Candidate
        </div>
        <div className="flex ml-5 text-gray-600 font-mono text-3xl">
          {candidate.candidate_name}
        </div>
      </div>
      {candidate.symbol && (
        <div className="flex flex-col">
          <div className="font-mono font-bold text-3xl mb-4 text-emerald-500">
            Symbol
          </div>
          <div className="flex flex-col ml-5 text-gray-600 font-mono mb-2 text-3xl justify-center">
            <div className="mb-2">{candidate.symbol.symbol_text}</div>
            <div className="flex text-gray-600 font-mono">
              {pticandidates_com_symbol ? (
                <img
                  style={{ height: '100px', width: '100px' }}
                  src={candidate.symbol.symbol_image}
                ></img>
              ) : pti_backed_symbol ? (
                <div>
                  <img
                    style={{ height: '100px', width: '100px' }}
                    src={pti_backed!.symbol_url}
                  ></img>
                  <div className="text-xs mt-4">
                    (
                    <a
                      href={'https://pticandidates.com/'}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      pticandidates.com
                    </a>{' '}
                    does have a symbol for this constituency, this symbol is
                    from sample ballot paper and is accurate.)
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

export default CandidateView
