import { stringToColor } from '../../../mapping/styles'
import { DistrictFeature } from '../../data'

const DistrictView = ({
  isMyDistrict,
  selectedDistrict
}: {
  isMyDistrict: boolean
  selectedDistrict: DistrictFeature
}) => {
  return (
    <div className="flex flex-col w-full relative">
      <div className="flex w-full h-full">
        <div
          className="flex bg-red-500"
          style={{
            height: '100%',
            width: '25px',
            backgroundColor: stringToColor(
              selectedDistrict.properties.DISTRICT_ID.toString()
            )
          }}
        ></div>
        <div className="flex flex-col flex-1">
          <div
            className="font-bold font-mono text-4xl px-4 py-4"
            style={{
              color: stringToColor(
                selectedDistrict.properties.DISTRICT_ID.toString()
              )
            }}
          >
            {selectedDistrict.properties.DISTRICT}
          </div>
          <div className="flex flex-col px-4 font-mono">
            <div className="mb-2 font-bold text-lg">
              Constituencies for every district coming soon!
            </div>
            <div>
              Meanwhile, you can search for your constituency in the bar above
              using the constituency code, district name or candidate name!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DistrictView
