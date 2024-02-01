import ColorbarPlot from './colorbar-plot'
import Map from "./map"
import TimeSlider from './time-slider'
import XYPlot from './xy-plot'

import './workspace.css'

function Workspace() {
  return (
    <div className='workspace'>
      <div>
        <Map />
        <ColorbarPlot />
      </div>
      <div>
        <TimeSlider />
      </div>
      <div>
        <XYPlot />
      </div>
    </div>
  )
}

export default Workspace
