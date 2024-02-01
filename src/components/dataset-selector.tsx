import { useState } from 'react'
import { useGlobalStateContext } from '../hooks/use-global-state'
import { IDataSet, IDataSetInfo, IRawDataSet } from '../types'

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
      const {positions, observations} = await result.json() as IRawDataSet

      const ymdDates = Object.keys(observations)

      const {minValue, maxValue} = Object.values(observations).reduce((acc, values) => {
        return values.reduce((acc2, value) => {
          if (value !== null) {
            acc2.minValue = Math.min(acc2.minValue, value)
            acc2.maxValue = Math.max(acc2.maxValue, value)
          }
          return acc2
        }, acc)
      }, {minValue: Infinity, maxValue: -Infinity})

      ymdDates.sort()

      const dataSet: IDataSet = {
        info,
        positions,
        observations,
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
