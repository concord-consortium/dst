import ColorbarPlot from './colorbar-plot'
import Map from "./map"
import TimeSlider from './time-slider'
import XYPlot from './xy-plot'

import './workspace.css'

function Workspace() {
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
    </div>
  )
}

export default Workspace
