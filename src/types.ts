export type IYMDDate = string // string in the form YYYY-MM-DD for easy sorting

export interface IDataSetInfo {
  name: string
  filename: string
  description: string
  observationName: string
}

export interface IPosition {
  lat: number
  long: number
}

export interface IDataSetRow {
  ymdDate: IYMDDate
  position: IPosition
  value: number
}

export interface IDataSet {
  info: IDataSetInfo
  rows: IDataSetRow[]
  ymdDates: IYMDDate[]
  minValue: number
  maxValue: number
  range: number
}

export interface IGlobalState {
  dataSet?: IDataSet
  selectedYMDDate?: IYMDDate
  selectedPosition?: IPosition
}

