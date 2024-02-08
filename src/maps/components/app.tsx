import { useEffect, useState } from 'react'
import { GlobalStateContext, getDefaultState, useGlobalStateContextValue } from '../hooks/use-global-state'
import Workspace from './workspace'
import DataSetSelector from './dataset-selector'
import { OptionsContext, useOptionsContextValue } from '../hooks/use-options'
import { formatDate } from '../helpers/format-date'

import './app.css'

function App() {
  const globalStateValue = useGlobalStateContextValue()
  const {globalState: { dataSet }, setGlobalState} = globalStateValue
  const optionsValue = useOptionsContextValue()
  const [title, setTitle] = useState<string|undefined>();

  useEffect(() => {
    if (dataSet) {
      optionsValue.setOptions(draft => {
        draft.gridSize = dataSet.info.gridSize
      })

      const {info, ymdDates} = dataSet
      const formattedDates = ymdDates.map(ymdDate => formatDate(new Date(ymdDate)))
      setTitle(`${info.observationName} from ${formattedDates[0]} to ${formattedDates[formattedDates.length - 1]}`)
    } else {
      setTitle(undefined)
    }
  }, [dataSet])

  const handleClearDataSet = () => setGlobalState(getDefaultState())

  return (
    <GlobalStateContext.Provider value={globalStateValue}>
      <OptionsContext.Provider value={optionsValue}>
        <div className='app'>
          <header>
            <div><a href="index.html">DST: SpaceTime</a> Maps</div>
            <div>{title && title}</div>
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
