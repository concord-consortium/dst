import ColorbarPlot from './colorbar-plot'
import Map from "./map"
import TimeSlider from './time-slider'
import XYPlot from './xy-plot'

import './workspace.css'
import { useGlobalStateContext } from '../hooks/use-global-state'

function Workspace() {
  const {globalState: {dataSet}} = useGlobalStateContext()

  return (
    <div className='workspace'>
      <div className='map-container'>
        <Map />
      </div>
      <div className='timeslider-container'>
        <TimeSlider />
      </div>
      <div className='graph-container'>
        <XYPlot />
        <ColorbarPlot />
      </div>
      {dataSet && <div className='debug-container'>
        <span><strong>DATASET INFO:</strong></span>
        <span>{Object.keys(dataSet.observations).length} dates</span>
        <span>{Object.keys(dataSet.positions).length} positions</span>
        <span>Min: {dataSet.minValue}</span>
        <span>Max: {dataSet.maxValue}</span>
        <span>Range: {dataSet.range}</span>
      </div>}
    </div>
  )
}

export default Workspace
