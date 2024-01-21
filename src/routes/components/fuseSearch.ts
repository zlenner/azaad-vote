import Fuse from 'fuse.js'
import { seats } from '../data'

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
  keys: ['seat', 'candidate.constituency_name', 'candidate.candidate_name']
}

const fuse = new Fuse(Object.values(seats), fuseOptions)

export default fuse
