import { GlobalStateContext, useGlobalStateContextValue } from '../hooks/use-global-state'
import ColorbarPlot from './colorbar-plot'
import Map from "./map"
import TimeSlider from './time-slider'
import XYPlot from './xy-plot'

import './app.css'

function App() {
  const globalState = useGlobalStateContextValue()

  return (
    <GlobalStateContext.Provider value={globalState}>
      <div className='app'>
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
    </GlobalStateContext.Provider>
  )
}

export default App
