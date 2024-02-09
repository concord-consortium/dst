import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Pane, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { icon, Icon, LatLngExpression } from 'leaflet';

import { useDataSet } from '../hooks/use-dataset';
import { useGlobalStateContext } from '../hooks/use-global-state';
import { IPosition, IMarker } from '../types';
import { Color, colors } from '../helpers/colors';
import { createWebGLHeatmap } from "./webgl-heatmap.js"
import { useOptionsContext } from '../hooks/use-options.js';

import 'leaflet/dist/leaflet.css';
import "./map.css"
import { placename } from '../helpers/placename.js';

const scaleSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABYwAAAABCAYAAAB9uep6AAAAAXNSR0IArs4c6QAAAo1JREFUWEfVWN26gzAIq+//znaf/YNAsLV6Ls5uNqdSGkKCHud55nQcKeWc0pFSyql8X4fjuP2dyuc6IR880mdrgGyu73fKffXXONbrQh5XfkfKJTFcv6ct+fl1bZ6Sh4nn1r/gaeuqhdi+6+ln+PSdhziWukh9oC4dn4HgKt4r1zU073hRNszrvIw3VHPQr+EogFt+CA4EH8pPyRP5Ylk9uY7wQ/dNLz/y+wHeE/4gb2NeSB9jI8/6dcrHHrjlSfkIOsKZ8Bk+ph6w7943TrW0fszxkb4mfGyhRpTlfkUlfF8X0686PNVzI/BqH6iv9/g4PnZemPVpXUC/mLuIM2zjQ/X8zt96HjkdxL98Hg9xnOhp9beYZ1P/dHpq4oX+2petO4zxxsLO/W6CTztd9h3NIaDnH+Oz0K9+vuD47M0hxj8HHjh/dWd8jbfrc6y01/N7f33Oxzl/AMdWn8oPIWbJGi+k8ybr15W+Fh83Edrh+NcAZudTPQ/Uccnj7bah5zlzPY+HejHGMhBywjPdV7Ih9QBg5nI0hpalBcTo+Et83Dxl8lzDW+GDNFKDwBwfmANaXcT3nfDe4wM3ysB07YfzQfk7rYNt7LafgD+jC4MHPYBZ89EPuPXswFULmJrnA0MZembbjMVrz2H/ER/UEz/42DI5/VnBh80N7r5Yz1A3hD9zvP2Dccgfy29jIJUP7/HheKMOYKPN++trfLbibeDD/UDmXPbCh/KxlIXzR/QE/b2+H4h9xM673t8exrvBh/H44tsuPnE89bxP+lYcUnju+0Xz0ffXZ3h327C+aBKK9UkF0PoTxKt4+/dpb/YD89xf4230arwvCf2N47M115D3fbq/GI/rPLHHRxbvByehOOUMvMCyAAAAAElFTkSuQmCC"

const HeatMap = () => {
  const map = useMap()
  const {options} = useOptionsContext()
  const {dataSet} = useDataSet()
  const {globalState: {selectedYMDDate}} = useGlobalStateContext()
  const webGLHeatmapRef = useRef<any>(null)
  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 575,
    pointerEvents: "none",
    opacity: 0.75
  }
  const canvasRef = useRef<HTMLCanvasElement|null>(null)

  useEffect(() => {
    webGLHeatmapRef.current = undefined
  }, [options])

  useEffect(() => {
    const updateCanvas = () => {
      if (!canvasRef.current) {
        return
      }

      // keep the canvas on top of the entire map
      const container = map.getContainer()
      const {width, height} = container.getBoundingClientRect()
      canvasRef.current.width = width
      canvasRef.current.height = height

      // apply an negative translation to the canvas as it is contained with the map pane that may
      // be transformed
      const mapPane = container.getElementsByClassName("leaflet-map-pane")[0] as HTMLElement
      const transform = mapPane.style.transform
      const match = transform?.match(/translate3d\(([0-9\-\.]+)px, ([0-9\-\.]+)px, ([0-9\-\.]+)px\)/)
      if (match) {
        const x = Number(match[1]) * -1;
        const y = Number(match[2]) * -1;
        const z = Number(match[3]) * -1;
        canvasRef.current.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`
      }

      if (!webGLHeatmapRef.current) {
        webGLHeatmapRef.current = createWebGLHeatmap({
          canvas: canvasRef.current,
          gradientTexture: scaleSrc,
          alphaRange: [options.alphaMin, options.alphaMax]
        })
      }
      webGLHeatmapRef.current.adjustSize()
      webGLHeatmapRef.current.clear()

      if (!selectedYMDDate) {
        return
      }

      // calculate the size of the dots by finding the distance between the grid points
      const p1 = map.latLngToContainerPoint([0, 0])
      const p2 = map.latLngToContainerPoint([options.gridSize, options.gridSize])
      const size = (p2.x - p1.x) * 6 // 6 found by experimenting to see what looks good

      const observations = dataSet.observations[selectedYMDDate]
      Object.values(dataSet.positions).forEach(position => {
        const observation = observations[position.index]
        if (observation !== undefined) {
          const point = map.latLngToContainerPoint(position.latLng)
          webGLHeatmapRef.current.addPoint(
            Math.floor(point.x),
            Math.floor(point.y),
            size,
            observation / dataSet.range
          )
        }
      })
      webGLHeatmapRef.current.update()
      webGLHeatmapRef.current.display()
    }

    map.on("load", updateCanvas)
    map.on("move", updateCanvas)
    map.on("zoom", updateCanvas)

    updateCanvas()

    return () => {
      map.off("load", updateCanvas)
      map.off("move", updateCanvas)
      map.off("zoom", updateCanvas)
    }
  }, [map, dataSet, selectedYMDDate, options])

  return (
    <Pane name="heatmapPane">
      <canvas ref={canvasRef} style={canvasStyle}/>
    </Pane>
  )
}

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
  const {dataSet: {placenames}} = useDataSet()
  const {position, color} = marker
  const {key, latLng} = position
  const label = placename(position, placenames)

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
        <div>{label}</div>
        <div><button onClick={handleRemove}>Remove Pin</button></div>
      </Popup>
    </Marker>
  )
}

function MarkerLayer() {
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
  const {dataSet: { info: { centerLatLng, zoomLevel }}} = useDataSet()

  return (
    <MapContainer center={centerLatLng} zoom={zoomLevel} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerLayer />
      <HeatMap />
    </MapContainer>
  )
}

export default Map

