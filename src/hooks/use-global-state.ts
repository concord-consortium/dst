import { createContext, useContext, useEffect } from "react";
import { Updater, useImmer } from "use-immer";
import { IGlobalState } from "../types";

const defaultState: IGlobalState = {}

export interface IGlobalStateContext {
  state: IGlobalState;
  setState: Updater<IGlobalState>;
}

export const useGlobalStateContextValue = (): IGlobalStateContext => {
  const [state, setState] = useImmer<IGlobalState>(defaultState);

  return {
    state,
    setState
  };
};

// note: the "setState: () => undefined" is fine as it is overridden in the AppContainer.Provider tag
export const GlobalStateContext = createContext<IGlobalStateContext>({state: defaultState, setState: () => undefined});
export const useStateContext = () => useContext(GlobalStateContext);
