import ColorbarPlot from './colorbar-plot'
import Map from "./map"
import TimeSlider from './time-slider'
import XYPlot from './xy-plot'
import { useDataSet } from '../hooks/use-dataset'
import { useGlobalStateContext } from '../hooks/use-global-state'

import './workspace.css'

function Workspace() {
  const {globalState: {selectedYMDDate, selectedPosition}} = useGlobalStateContext()
  const { dataSet } = useDataSet()

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
      <div className='debug-container'>
        <span><strong>DATASET:</strong></span>
        <span>{Object.keys(dataSet.observations).length} dates</span>
        <span>{Object.keys(dataSet.positions).length} positions</span>
        <span><strong>GLOBAL STATE:</strong></span>
        <span>Date: {selectedYMDDate ?? "n/a"}</span>
        <span>Position: {selectedPosition ? JSON.stringify(selectedPosition) : "n/a"}</span>
      </div>
    </div>
  )
}

export default Workspace
