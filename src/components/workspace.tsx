import ColorbarPlot from './colorbar-plot'
import Map from "./map"
import TimeSlider from './time-slider'
import XYPlot from './xy-plot'
import { useGlobalStateContext } from '../hooks/use-global-state'

import './workspace.css'

function Workspace() {
  const {globalState: {selectedPositions}} = useGlobalStateContext()

  const renderGraphs = () => {
    if (selectedPositions.length === 0) {
      return (
        <div className="no-positions-note">
          Click on the map to add locations to graph
        </div>
      )
    }

    return (
      <>
        <XYPlot />
        <ColorbarPlot />
      </>
    )
  }

  return (
    <div className='workspace'>
      <div className='map-container'>
        <Map />
      </div>
      <div className='timeslider-container'>
        <TimeSlider />
      </div>
      <div className='graph-container'>
        {renderGraphs()}
      </div>
    </div>
  )
}

export default Workspace
