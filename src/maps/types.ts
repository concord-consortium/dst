import type { LatLngExpression } from "leaflet"
import type { Color } from "./helpers/colors"

export type ILatLongKey = string // string in the form lat,long for use as map keys
export type IYMDDate = string // string in the form YYYY-MM-DD for easy sorting

export type ILatLongMap = Record<ILatLongKey,number>
export type IObservationMap = Record<IYMDDate,number[]>

export interface IDataSetInfo {
  name: string
  filename: string
  description: string
  observationName: string
  gridSize: number
  centerLatLng: LatLngExpression
  zoomLevel: number
}

export interface IRawDataSet {
  positions: ILatLongMap
  observations: IObservationMap
}

export interface IPosition {
  key: ILatLongKey, latLng: LatLngExpression, index: number
}
export type IPositionMap = Record<ILatLongKey,IPosition>

export interface IMarker {
  color: Color
  position: IPosition
}

export interface IDataSet {
  info: IDataSetInfo
  positions: IPositionMap
  observations: IObservationMap
  ymdDates: IYMDDate[]
  minValue: number
  maxValue: number
  range: number
}

export interface IGlobalState {
  dataSet?: IDataSet
  selectedYMDDate?: IYMDDate
  selectedMarkers: IMarker[]
}

