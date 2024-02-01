import './app.css'
import ColorbarPlot from './colorbar-plot'
import Map from "./map"
import TimeSlider from './time-slider'
import XYPlot from './xy-plot'

function App() {
  return (
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
  )
}

export default App
