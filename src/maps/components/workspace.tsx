import ColorbarPlot from './colorbar-plot'
import Map from "./map"
import TimeSlider from './time-slider'
import XYPlot from './xy-plot'
import Options from './options'
import MapLegend from './map-legend'
import { useGlobalStateContext } from '../hooks/use-global-state'

import './workspace.css'

function Workspace() {
  const {globalState: {selectedMarkers}} = useGlobalStateContext()

  const renderGraphs = () => {
    if (selectedMarkers.length === 0) {
      return (
        <div className="no-markers-note">
          Click on the map above to add markers.
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
        <MapLegend />
        <Map />
        <Options />
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
