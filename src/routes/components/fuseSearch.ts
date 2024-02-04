import Fuse from 'fuse.js'
import { Seat } from '../../hooks/useData/useLoadData'

const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: [
    'seat',
    'pti_data.constituency_name',
    'pti_data.candidate_name',
    'form33_data.constituency_name'
  ]
}

const fuseSearch = (seats: { [key: string]: Seat }) => {
  return new Fuse(Object.values(seats), fuseOptions)
}

export default fuseSearch
