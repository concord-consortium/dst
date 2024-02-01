import { createContext, useContext, useEffect } from "react";
import { Updater, useImmer } from "use-immer";
import { IGlobalState } from "../types";

const defaultState: IGlobalState = {}

export interface IGlobalStateContext {
  globalState: IGlobalState;
  setGlobalState: Updater<IGlobalState>;
}

export const useGlobalStateContextValue = (): IGlobalStateContext => {
  const [globalState, setGlobalState] = useImmer<IGlobalState>(defaultState);

  return {
    globalState,
    setGlobalState
  };
};

// note: the "setState: () => undefined" is fine as it is overridden in the AppContainer.Provider tag
export const GlobalStateContext = createContext<IGlobalStateContext>({globalState: defaultState, setGlobalState: () => undefined});
export const useGlobalStateContext = () => useContext(GlobalStateContext);
