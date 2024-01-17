import { ProvincialFeature } from '../models'

const COLORS = [
  '#22bc59',
  '#F5E055',
  '#58C5FF',
  '#FF9411',
  '#76F49F',
  '#FF7070',
  '#F6A6EC'
]

export const polygonStyle = (feature: ProvincialFeature) => ({
  fillColor: stringToColor(feature.properties.PA),
  weight: 2,
  opacity: 1,
  color: '#666666', // Border color
  fillOpacity: 0.5
})

// Hash function to create a number from a string
const hashString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

// Function to generate a color based on a seed
const stringToColor = (PA: string) => {
  const hash = hashString(PA)
  const index = Math.abs(hash) % COLORS.length // Ensure positive index and within range
  return COLORS[index]
}
