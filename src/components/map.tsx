import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { useDataSet } from '../hooks/use-dataset';
import { useGlobalStateContext } from '../hooks/use-global-state';
import { INumericPosition } from '../types';

import "./map.css"

const usCenter: LatLngExpression = [39.833333, -98.585522]

function MapMarker({numericPosition}: {numericPosition: INumericPosition}) {
  const {setGlobalState} = useGlobalStateContext()
  const {key, lat, lng} = numericPosition

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setGlobalState(draft => {
      const index = draft.selectedNumericPositions.findIndex(np => np.key === key)
      draft.selectedNumericPositions.splice(index, 1)
    })
  }

  return (
    <Marker position={[lat, lng]}>
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
  const {globalState: {selectedNumericPositions}, setGlobalState} = useGlobalStateContext()

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
          const index = draft.selectedNumericPositions.findIndex(np => np.key === numericPosition.key)
          if (index === -1) {
            draft.selectedNumericPositions.push(numericPosition)
          }
        })
      }
    },
  })

  return (
    <>
      {selectedNumericPositions.map(np => <MapMarker key={np.key} numericPosition={np} />)}
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

