import { useState } from 'react'
import { useGlobalStateContext } from '../hooks/use-global-state'
import { IDataSet, IDataSetInfo, IPositionMap, IRawDataSet } from '../types'
import { LatLngExpression } from 'leaflet'

import './dataset-selector.css'

const availableDataSets: IDataSetInfo[] = [
  {name: "NOAA Weather", filename: "noaa-weather.json", description: "", observationName: "Precipitation", gridSize: 0.25, centerLatLng: [42.64649054610893, -73.3387699585061], zoomLevel: 6},
  {name: "NEO Precipitation", filename: "neo-precip.json", description: "", observationName: "Precipitation", gridSize: 0.5, centerLatLng: [39.833333, -98.585522], zoomLevel: 4},
]

function DataSetSelector() {
  const { setGlobalState } = useGlobalStateContext()
  const [loading, setLoading] = useState(false)

  const handleSelectDataSet = (info: IDataSetInfo) => {
    const selectDataSet = async () => {
      setLoading(true)

      try {
        const url = `datasets/${info.filename}`
        const result = await fetch(url)
        const {positions: rawPositions, observations, placenames} = await result.json() as IRawDataSet

        const ymdDates = Object.keys(observations)
        ymdDates.sort()

        const {minValue, maxValue} = Object.values(observations).reduce((acc, values) => {
          return values.reduce((acc2, value) => {
            if (value !== null) {
              acc2.minValue = Math.min(acc2.minValue, value)
              acc2.maxValue = Math.max(acc2.maxValue, value)
            }
            return acc2
          }, acc)
        }, {minValue: Infinity, maxValue: -Infinity})

        const positions: IPositionMap = {}
        for (const [key, index] of Object.entries(rawPositions)) {
          const [lat, lng] = key.split(",")
          const latLng: LatLngExpression = [Number(lat), Number(lng)]
          positions[key] = {key, latLng, index}
        }

        const dataSet: IDataSet = {
          info,
          positions,
          observations,
          placenames,
          ymdDates,
          minValue,
          maxValue,
          range: maxValue - minValue
        }

        setGlobalState(draft => {
          draft.dataSet = dataSet
        })
      } catch (e) {
        alert(e)
      }

      setLoading(false)
    }

    selectDataSet().catch(console.error)
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
