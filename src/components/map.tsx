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

const scaleSrc = "data:image/png;base64,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"

const usCenter: LatLngExpression = [39.833333, -98.585522]

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
        if (observation !== null) {
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

  return (
    <MapContainer center={usCenter} zoom={4} scrollWheelZoom={true}>
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

