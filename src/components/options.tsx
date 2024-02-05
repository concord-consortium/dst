import { useOptionsContext } from '../hooks/use-options'
import './options.css'

const params = new URLSearchParams(window.location.search)
const showDebugOptions = params.get("showOptions") === "true"

function Options() {
  const {options, setOptions} = useOptionsContext()

  const handleSetAlphaMin = (e: React.ChangeEvent<HTMLInputElement>) => setOptions(draft => {
    draft.alphaMin = Number(e.target.value)
  })
  const handleSetAlphaMax = (e: React.ChangeEvent<HTMLInputElement>) => setOptions(draft => {
    draft.alphaMax = Number(e.target.value)
  })
  const handleSetGridSize = (e: React.ChangeEvent<HTMLInputElement>) => setOptions(draft => {
    draft.gridSize = Number(e.target.value)
  })
  const handleSetAnimationDuration = (e: React.ChangeEvent<HTMLInputElement>) => setOptions(draft => {
    draft.animationDuration = Number(e.target.value)
  })

  if (!showDebugOptions) {
    return null
  }

  return (
    <div className='options'>
      <legend>Map Options</legend>
      <div>
        <strong>Alpha Min</strong>
        <input type="number" min="0" max="1" step="0.01" value={options.alphaMin} onChange={handleSetAlphaMin} />

        <strong>Alpha Max</strong>
        <input type="number" min="0" max="1" step="0.01" value={options.alphaMax} onChange={handleSetAlphaMax} />

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
