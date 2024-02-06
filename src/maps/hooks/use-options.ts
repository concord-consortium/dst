import { createContext, useContext } from "react";
import { Updater, useImmer } from "use-immer";

export const getDefaultOptions = (): IOptions => {
  return {
    alphaMin: 0,
    alphaMax: 0.05,
    gridSize: 0.25,
    animationDuration: 500,
  }
}

export interface IOptions {
  alphaMin: number
  alphaMax: number
  gridSize: number;
  animationDuration: number;
}

export interface IOptionsContext {
  options: IOptions;
  setOptions: Updater<IOptions>;
}

export const useOptionsContextValue = (): IOptionsContext => {
  const [options, setOptions] = useImmer<IOptions>(getDefaultOptions());

  return {
    options,
    setOptions
  };
};

// note: the "setGlobalState: () => undefined" is fine as it is overridden in the AppContainer.Provider tag
export const OptionsContext = createContext<IOptionsContext>({options: getDefaultOptions(), setOptions: () => undefined});
export const useOptionsContext = () => useContext(OptionsContext);
