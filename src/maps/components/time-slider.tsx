import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDataSet } from "../hooks/use-dataset"
import { useGlobalStateContext } from "../hooks/use-global-state"
import { formatDate, toDateUTC } from "../helpers/format-date"
import { useOptionsContext } from "../hooks/use-options"

import "./time-slider.css"

function TimeSlider() {
  const { dataSet: { ymdDates } } = useDataSet()
  const { globalState: { selectedYMDDate }, setGlobalState } = useGlobalStateContext()
  const [isPlaying, setIsPlaying] = useState(false)
  const lastDateIndex = ymdDates.length - 1
  const {options: {animationDuration}} = useOptionsContext()
  const animationIntervalRef = useRef(0)
  // this is used so value isn't captured in the new setValue method
  const valueRef = useRef(0);

  const value = useMemo(() => {
    const newValue = Math.max(0, ymdDates.indexOf(selectedYMDDate ?? ""));
    valueRef.current = newValue
    return newValue
  }, [selectedYMDDate, ymdDates]);

  const updateGlobalState = useCallback((newValue: number) => {
    setGlobalState(draft => {
      draft.selectedYMDDate = ymdDates[newValue]
    })
  }, [setGlobalState, ymdDates]);

  const setValue = useCallback((newValueOrCallback: number|((prevValue: number) => number)) => {
    const newValue = typeof newValueOrCallback === "number"
      ? newValueOrCallback
      : newValueOrCallback(valueRef.current)
    valueRef.current = newValue
    updateGlobalState(newValue);
  }, [value]);

  useEffect(() => {
    setGlobalState(draft => {
      draft.selectedYMDDate = ymdDates[value]
    })
  }, [ymdDates, value, setGlobalState])

  useEffect(() => {
    if (isPlaying) {
      clearInterval(animationIntervalRef.current)
      animationIntervalRef.current = window.setInterval(() => {
        setValue(prevValue => {
          const newValue = prevValue + 1
          if (newValue > lastDateIndex) {
            setIsPlaying(false)
            return lastDateIndex
          }
          return newValue
        })
      }, animationDuration)
      return () => clearInterval(animationIntervalRef.current)
    }
  }, [isPlaying, lastDateIndex, animationDuration])

  const displayDates = useMemo(() => {
    return ymdDates.map(ymdDate => formatDate(toDateUTC(ymdDate)))
  }, [ymdDates])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value))
  }, [setValue])

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      if (value === lastDateIndex) {
        setValue(0)
      }
      setIsPlaying(true)
    }
  }

  return (
    <div className="time-slider">
      <button className="play-button" onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <div onClick={() => setValue(0)}>{displayDates[0]}</div>
      <div>
        <input
          type="range"
          min={0}
          step={1}
          max={lastDateIndex}
          value={value}
          onChange={handleChange}
        ></input>
        {displayDates[value]}
      </div>
      <div onClick={() => setValue(lastDateIndex)}>{displayDates[lastDateIndex]}</div>
    </div>
  )
}

export default TimeSlider