import provincialSeatsGeoJson from '../geojson/provincial.json'
import candidatesJson from '../geojson/candidates.json'
import { Candidate, ProvincialGeoJson } from '../models'
import { useParams } from 'react-router-dom'
import { polygonStyle } from '../mapping/styles'
import Header from './components/Header'
import Map from './Map'
import BackgroundImage from './components/BackgroundImage'
import ConstituencyView from './components/ConstituencyView'

const provincialSeats = provincialSeatsGeoJson as ProvincialGeoJson

function App() {
  const { seat = null } = useParams()

  const currentFeature = provincialSeats.features.find(
    (f) => f.properties.PA === seat
  )

  const CURRENT = {
    feature: currentFeature,
    style: currentFeature && polygonStyle(currentFeature),
    candidate:
      currentFeature &&
      ((candidatesJson as any)[currentFeature.properties.PA] as Candidate)
  }

  return (
    <div className="flex flex w-full h-full">
      <div
        className="flex flex-col w-full h-full"
        style={{ width: '50%', maxWidth: 850 }}
      >
        <Header goToMyConstituency={() => {}} />
        <div className="flex flex-1 w-full">
          {!CURRENT.feature ? (
            <BackgroundImage />
          ) : (
            <ConstituencyView
              feature={CURRENT.feature}
              color={CURRENT.style!.fillColor}
              candidate={CURRENT.candidate}
            />
          )}
        </div>
      </div>
      <Map />
    </div>
  )
}

export default App
