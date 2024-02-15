import { useGlobalStateContext } from '../hooks/use-global-state';
import { useOptionsContext } from '../hooks/use-options'
import './options.css'

function Options() {
  const {options, setOptions} = useOptionsContext();
  const {globalState} = useGlobalStateContext();

  const handleSetGridSize = (e: React.ChangeEvent<HTMLInputElement>) => setOptions(draft => {
    draft.gridSize = Number(e.target.value)
  })
  const handleSetAnimationDuration = (e: React.ChangeEvent<HTMLInputElement>) => setOptions(draft => {
    draft.animationDuration = Number(e.target.value)
  })

  if (!globalState.showOptions) {
    return null
  }

  return (
    <div className='options'>
      <legend>Map Options</legend>
      <div>
        <strong>Grid Size</strong>
        <input type="number" min="0" max="1" step="0.01" value={options.gridSize} onChange={handleSetGridSize} />

        <div style={{width: 200, margin: "1rem 0"}}>
          NOTE: the grid size can be set per dataset.
        </div>
      </div>

      <legend>Time Slider Options</legend>
      <div>
        <strong>Animation Interval (ms)</strong>
        <input type="number" min="0" value={options.animationDuration} onChange={handleSetAnimationDuration} />
      </div>
    </div>
  )
}

export default Options
