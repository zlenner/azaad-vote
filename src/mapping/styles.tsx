const COLORS = [
  '#22bc59',
  '#F5E055',
  '#58C5FF',
  '#FF9411',
  '#76F49F',
  '#FF7070',
  '#F6A6EC'
]

// Hash function to create a number from a string
const hashString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

// Function to generate a color based on a seed
export const stringToColor = (PA: string) => {
  const hash = hashString(PA)
  const index = Math.abs(hash) % COLORS.length // Ensure positive index and within range
  return COLORS[index]
}
