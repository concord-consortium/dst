import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { icon, Icon, LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { useDataSet } from '../hooks/use-dataset';
import { useGlobalStateContext } from '../hooks/use-global-state';
import { IPosition, IMarker } from '../types';
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

function MapMarker({marker}: {marker: IMarker}) {
  const {setGlobalState} = useGlobalStateContext()
  const {position, color} = marker
  const {key, latLng} = position

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setGlobalState(draft => {
      const index = draft.selectedMarkers.findIndex(marker => marker.position.key === key)
      draft.selectedMarkers.splice(index, 1)
    })
  }

  return (
    <Marker position={latLng} icon={markerIcons[color]}>
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
  const {globalState: {selectedMarkers}, setGlobalState} = useGlobalStateContext()

  useMapEvents({
    click: (e) => {
      const clickedAt: LatLngExpression = [e.latlng.lat, e.latlng.lng]
      const result = Object.keys(dataSet.positions).reduce<{position: IPosition|null, distance: number}>((acc, key) => {
        const position = dataSet.positions[key]
        const distance = map.distance(clickedAt, position.latLng)
        if (distance < acc.distance) {
          acc.distance = distance
          acc.position = position
        }
        return acc
      }, {position: null, distance: Infinity})

      // TODO: add max distance?

      const {position} = result
      if (position) {
        setGlobalState(draft => {
          const index = draft.selectedMarkers.findIndex(marker => marker.position.key === position.key)
          if (index === -1) {
            const replace = draft.selectedMarkers.length >= colors.length
            if (replace) {
              draft.selectedMarkers.shift()
            }
            const availableColors = [...colors]
            draft.selectedMarkers.forEach(cur => availableColors.splice(availableColors.indexOf(cur.color), 1))
            draft.selectedMarkers.push({position, color: availableColors[0]})
          }
        })
      }
    }
  })

  return (
    <>
      {selectedMarkers.map(marker => <MapMarker key={marker.position.key} marker={marker} />)}
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

