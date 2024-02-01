import { GlobalStateContext, getDefaultState, useGlobalStateContextValue } from '../hooks/use-global-state'

import Workspace from './workspace'
import DataSetSelector from './dataset-selector'

import './app.css'

function App() {
  const globalState = useGlobalStateContextValue()
  const {globalState: { dataSet }, setGlobalState} = globalState

  const handleClearDataSet = () => setGlobalState(getDefaultState())

  return (
    <GlobalStateContext.Provider value={globalState}>
      <div className='app'>
        <header>
          <div>DST: SpaceTime</div>
          {dataSet && <div role='button' onClick={handleClearDataSet} title="Click here to select a different dataset">{dataSet.info.name}</div>}
        </header>
        {!dataSet && <DataSetSelector />}
        {dataSet && <Workspace />}
      </div>
    </GlobalStateContext.Provider>
  )
}

export default App
