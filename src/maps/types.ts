import type { LatLngExpression } from "leaflet"
import type { Color } from "./helpers/colors"

export type ILatLongKey = string // string in the form lat,long for use as map keys
export type IYMDDate = string // string in the form YYYY-MM-DD for easy sorting

export type ILatLongMap = Record<ILatLongKey,number>
export type IObservationMap = Record<IYMDDate,Array<number|undefined>>
export type IPlacenameMap = Record<ILatLongKey,string|undefined>

export interface IDataSetInfo {
  name: string
  filename: string
  description: string
  observationName: string
  gridSize: number
  centerLatLng: LatLngExpression
  zoomLevel: number
  units: string
}

export interface IRawDataSet {
  positions: ILatLongMap
  observations: IObservationMap
  placenames: IPlacenameMap
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
  placenames: IPlacenameMap
  ymdDates: IYMDDate[]
  minValue: number
  maxValue: number
  range: number
}

export interface IGlobalState {
  dataSet?: IDataSet
  selectedYMDDate?: IYMDDate
  selectedMarkers: IMarker[]
  showOptions: boolean
}

