import { useGlobalStateContext } from "./use-global-state"

export const useDataSet = () => {
  const {globalState: {dataSet}} = useGlobalStateContext()

  return {
    dataSet: dataSet!
  }
}