import { useState } from 'react'
import { useGlobalStateContext } from '../hooks/use-global-state'
import { IDataSet, IDataSetInfo, IDataSetRow, IYMDDate } from '../types'

import './dataset-selector.css'

const availableDataSets: IDataSetInfo[] = [
  {name: "NOAA Weather", filename: "noaa-weather.json", description: "", observationName: "TDB"},
  {name: "NEO Precipitation", filename: "neo-precip.json", description: "", observationName: "Precipitation"},
]

function DataSetSelector() {
  const { setGlobalState } = useGlobalStateContext()
  const [loading, setLoading] = useState(false)

  const handleSelectDataSet = async (info: IDataSetInfo) => {
    setLoading(true)

    try {
      const url = `datasets/${info.filename}`
      const result = await fetch(url)
      const rows: IDataSetRow[] = await result.json()

      const ymdDatesSet = new Set<IYMDDate>()
      const {minValue, maxValue} = rows.reduce((acc, cur) => {
        acc.minValue = Math.min(acc.minValue, cur.value)
        acc.maxValue = Math.max(acc.maxValue, cur.value)
        return acc
      }, {minValue: Infinity, maxValue: -Infinity})

      const ymdDates = Array.from(ymdDatesSet)
      ymdDates.sort()

      const dataSet: IDataSet = {
        info,
        rows,
        ymdDates,
        minValue,
        maxValue,
        range: maxValue - minValue
      }

      setGlobalState({ dataSet })
    } catch (e) {
      alert(e)
    }

    setLoading(false)
  }

  const renderButtons = () => {
    return (
      <div>
        {availableDataSets.map(info => (
          <button key={info.filename} disabled={loading} onClick={() => handleSelectDataSet(info)}>{info.name}</button>
        ))}
      </div>
    )
  }

  return (
    <div className="dataset-selector">
      <div>Select a dataset:</div>
      {loading && <div>Loading...</div>}
      {!loading && renderButtons()}
    </div>
  )
}

export default DataSetSelector
