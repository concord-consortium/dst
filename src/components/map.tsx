import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import { LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';

const ccEast: LatLngExpression = [42.456614,-71.3607501]

function MapClickLayer() {
  useMapEvents({
    click: (e) => {
      console.log("CLICKED", e.latlng)
      // TODO: find closest position in dataset and set selected position
      // in global state
    },
  })
  return null
}

function Map() {
  return (
    <MapContainer center={ccEast} zoom={7} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={ccEast}>
        <Popup>
          Concord Consortium East. <br /> 25 Love Lane, Concord, MA.
        </Popup>
      </Marker>
      <MapClickLayer />
    </MapContainer>
  )
}

export default Map

