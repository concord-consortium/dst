import type { IPlacenameMap, IPosition } from "../types";

export const placename = (position: IPosition, placenames: IPlacenameMap) => {
  return placenames[position.key] || `${position.key.replace(",", ", ")} (Ocean)`
}