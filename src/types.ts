export type ILatLong = string // string in the form lat,long for use as map keys
export type IYMDDate = string // string in the form YYYY-MM-DD for easy sorting

export type ILatLongMap = Record<ILatLong,number>
export type IObservationMap = Record<IYMDDate,number[]>

export interface IDataSetInfo {
  name: string
  filename: string
  description: string
  observationName: string
}

export interface IRawDataSet {
  positions: ILatLongMap
  observations: IObservationMap
}

export interface INumericPosition {
  key: string, lat: number, lng: number, index: number
}

export interface IDataSet {
  info: IDataSetInfo
  positions: ILatLongMap
  numericPositions: INumericPosition[]
  observations: IObservationMap
  ymdDates: IYMDDate[]
  minValue: number
  maxValue: number
  range: number
}

export interface IGlobalState {
  dataSet?: IDataSet
  selectedYMDDate?: IYMDDate
  selectedNumericPositions: INumericPosition[]
}

