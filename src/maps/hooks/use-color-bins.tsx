import { useEffect, useState } from "react";
import { colors, rgbToHex } from "../helpers/color-helpers";
import { useDataSet } from "./use-dataset";
import { dynamicRound } from "../helpers/dynamic-round";

type Bin = {
  value: number,
  label: string,
  color: string
}

export const useColorBins = () => {
  const {dataSet} = useDataSet();
  const [bins, setBins] = useState<Bin[]>([]);

  useEffect(() => {
    const newBins: Bin[] = [];
    const {range, minValue, maxValue} = dataSet;
    const binLength = 20;
    const binSize = range / binLength;
    for (let i = 0; i < binLength; i++) {
        const value = minValue + (i * binSize);
        const nextValue = i === binLength - 1 ? maxValue : minValue + ((i + 1) * binSize);
        const valueLabel = range < 20 ? dynamicRound(value) : Math.round(value);
        const nextValueLabel = range < 20 ? dynamicRound(nextValue) : Math.round(nextValue);
        newBins.push({
          value: i === binLength - 1 ? maxValue : value,
          label: `${valueLabel} - ${nextValueLabel}`,
          color: rgbToHex(colors[i])
        });
    }
    setBins(newBins);
  }, [dataSet])

  return {
    bins
  };
}