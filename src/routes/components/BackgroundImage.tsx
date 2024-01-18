import PTIElectionSymbol from '../../assets/nobg.png'

const BackgroundImage = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img
        className="rounded-md mb-5"
        style={{
          filter: 'grayscale(100%)',
          opacity: 0.1,
          width: 350,
          height: 350
        }}
        src={PTIElectionSymbol}
      />
    </div>
  )
}

export default BackgroundImage
