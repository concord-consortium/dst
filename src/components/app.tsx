import { useEffect } from 'react'

import { GlobalStateContext, getDefaultState, useGlobalStateContextValue } from '../hooks/use-global-state'
import Workspace from './workspace'
import DataSetSelector from './dataset-selector'
import { OptionsContext, useOptionsContextValue } from '../hooks/use-options'

import './app.css'

function App() {
  const globalStateValue = useGlobalStateContextValue()
  const {globalState: { dataSet }, setGlobalState} = globalStateValue
  const optionsValue = useOptionsContextValue()

  useEffect(() => {
    if (dataSet) {
      optionsValue.setOptions(draft => {
        draft.gridSize = dataSet.info.gridSize
      })
    }
  }, [dataSet])

  const handleClearDataSet = () => setGlobalState(getDefaultState())

  return (
    <GlobalStateContext.Provider value={globalStateValue}>
      <OptionsContext.Provider value={optionsValue}>
        <div className='app'>
          <header>
            <div>DST: SpaceTime</div>
            {dataSet && <div role='button' onClick={handleClearDataSet} title="Click here to select a different dataset">{dataSet.info.name}</div>}
          </header>
          {!dataSet && <DataSetSelector />}
          {dataSet && <Workspace />}
        </div>
      </OptionsContext.Provider>
    </GlobalStateContext.Provider>
  )
}

export default App
