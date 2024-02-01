import { useCallback, useEffect, useMemo, useState } from "react"
import { useDataSet } from "../hooks/use-dataset"
import { useGlobalStateContext } from "../hooks/use-global-state"

import "./time-slider.css"

const formatDate = (date: Date): string => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
}

function TimeSlider() {
  const { dataSet: { ymdDates } } = useDataSet()
  const { setGlobalState }  = useGlobalStateContext()
  const [value, setValue] = useState(0)
  const lastDateIndex = ymdDates.length - 1

  useEffect(() => {
    setGlobalState(draft => {
      draft.selectedYMDDate = ymdDates[value]
    })
  }, [ymdDates, value, setGlobalState])

  const displayDates = useMemo(() => {
    return ymdDates.map(ymdDate => formatDate(new Date(ymdDate)))
  }, [ymdDates])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value))
  }, [setValue])

  return (
    <div className="time-slider">
      <div onClick={() => setValue(0)}>{displayDates[0]}</div>
      <div>
        <input type="range" min={0} step={1} max={lastDateIndex} value={value} onChange={handleChange}></input>
        {displayDates[value]}
      </div>
      <div onClick={() => setValue(lastDateIndex)}>{displayDates[lastDateIndex]}</div>
    </div>
  )
}

export default TimeSlider