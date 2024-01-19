import provincialSeatsGeoJson from '../geojson/provincial.json'
import candidatesJson from '../geojson/candidates.json'
import { Candidate, ProvincialGeoJson } from '../models'
import { useParams } from 'react-router-dom'
import { stringToColor } from '../mapping/styles'
import Header from './components/Header'
import Map from './Map'
import BackgroundImage from './components/BackgroundImage'
import ConstituencyView from './components/ConstituencyView'

const provincialSeats = provincialSeatsGeoJson as ProvincialGeoJson

function App() {
  const { seat = null } = useParams()

  const selectedFeature = provincialSeats.features.find(
    (f) => f.properties.PA === seat
  )

  const SELECTED = {
    feature: selectedFeature,
    color: selectedFeature && stringToColor(selectedFeature.properties.PA),
    candidate:
      selectedFeature &&
      ((candidatesJson as any)[selectedFeature.properties.PA] as Candidate)
  }

  return (
    <div className="flex flex w-full h-full">
      <div
        className="flex flex-col w-full h-full"
        style={{ width: '50%', maxWidth: 850 }}
      >
        <Header goToMyConstituency={() => {}} />
        <div className="flex flex-1 w-full">
          {!SELECTED.feature ? (
            <BackgroundImage />
          ) : (
            <ConstituencyView
              feature={SELECTED.feature}
              color={SELECTED.color ?? ''}
              candidate={SELECTED.candidate}
            />
          )}
        </div>
      </div>
      <Map selectedConstituency={SELECTED.feature} />
    </div>
  )
}

export default App
