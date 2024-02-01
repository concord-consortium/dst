import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { icon, Icon, LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { useDataSet } from '../hooks/use-dataset';
import { useGlobalStateContext } from '../hooks/use-global-state';
import { INumericPosition, IPosition } from '../types';
import { Color, colors } from '../helpers/colors';

import "./map.css"

const usCenter: LatLngExpression = [39.833333, -98.585522]

const createIcon = (colorName: string) => {
  return icon({
    iconUrl: `assets/marker-icon-${colorName}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
}

const markerIcons: Record<Color, Icon> = {
  "#2A81CB": createIcon("blue"),
  "#FFD326": createIcon("gold"),
  "#CB2B3E": createIcon("red"),
  "#2AAD27": createIcon("green"),
  "#CB8427": createIcon("orange"),
}

function MapMarker({position}: {position: IPosition}) {
  const {setGlobalState} = useGlobalStateContext()
  const {numericPosition, color} = position
  const {key, lat, lng} = numericPosition

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setGlobalState(draft => {
      const index = draft.selectedPositions.findIndex(np => np.numericPosition.key === key)
      draft.selectedPositions.splice(index, 1)
    })
  }

  return (
    <Marker position={[lat, lng]} icon={markerIcons[color]}>
      <Popup>
        {key}
        <button onClick={handleRemove}>Remove</button>
      </Popup>
    </Marker>
  )
}

function MapClickLayer() {
  const map = useMap()
  const {dataSet} = useDataSet()
  const {globalState: {selectedPositions: selectedNumericPositions}, setGlobalState} = useGlobalStateContext()

  useMapEvents({
    click: (e) => {
      const clickedAt: LatLngExpression = [e.latlng.lat, e.latlng.lng]
      const result = dataSet.numericPositions.reduce<{numericPosition: INumericPosition|null, distance: number}>((acc, cur) => {
        const distance = map.distance(clickedAt, [cur.lat, cur.lng])
        if (distance < acc.distance) {
          acc.distance = distance
          acc.numericPosition = cur
        }
        return acc
      }, {numericPosition: null, distance: Infinity})

      // TODO: add max distance?

      if (result.numericPosition) {
        const numericPosition = result.numericPosition
        setGlobalState(draft => {
          const index = draft.selectedPositions.findIndex(np => np.numericPosition.key === numericPosition.key)
          if (index === -1) {
            const replace = draft.selectedPositions.length >= colors.length
            if (replace) {
              draft.selectedPositions.shift()
            }
            const availableColors = [...colors]
            draft.selectedPositions.forEach(cur => availableColors.splice(availableColors.indexOf(cur.color), 1))
            draft.selectedPositions.push({numericPosition, color: availableColors[0]})
          }
        })
      }
    },
  })

  return (
    <>
      {selectedNumericPositions.map(np => <MapMarker key={np.numericPosition.key} position={np} />)}
    </>
  )
}

function Map() {
  return (
    <MapContainer center={usCenter} zoom={4} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickLayer />
    </MapContainer>
  )
}

export default Map

