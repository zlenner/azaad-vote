// Attach event handlers to each feature
export const onEachFeature = (feature: any, layer: any) => {
  layer.on({
    mouseover: (event: any) => {
      const layer = event.target
      layer.setStyle({
        fillOpacity: 0.9
      })
    },
    mouseout: (event: any) => {
      const layer = event.target
      layer.setStyle({
        fillOpacity: 0.6
      })
    },
    click: (event: any) => {
      const layer = event.target
      console.log(layer.feature)
    }
  })
}
