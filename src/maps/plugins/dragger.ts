import { Chart } from "chart.js";
import { IDataSet, IGlobalState } from "../types";
import { Updater } from "use-immer";

type DragDirection = "upDown" | "leftRight";

type DragInfo = {
  dragging: boolean;
}

let dragInfo: DragInfo|null = null;
let dataSet: IDataSet|null = null;
let setGlobalState: Updater<IGlobalState>|null = null;

export const setupDragger = (newDataSet: IDataSet, newSetGlobalState: Updater<IGlobalState>) => {
  dataSet = newDataSet;
  setGlobalState = newSetGlobalState;
}

export const startAnnotationDragListener = () => {
  if (!dragInfo?.dragging) {
    dragInfo = {
      dragging: false
    }
  }
};

export const stopAnnotationDragListener = () => {
  if (!dragInfo?.dragging) {
    dragInfo = null;
  }
};

const updateSelectedYMDDate = (chart: Chart, event: any) => {
  if (!dataSet || !setGlobalState) {
    return;
  }

  const chartArea = chart.chartArea;
  const dragDirection = (chart.config.options as any).dragDirection as DragDirection;

  let percentage: number;
  if (dragDirection === "leftRight") {
    percentage = (event.x - chartArea.left) / chartArea.width;
  } else {
    percentage = (chartArea.bottom - event.y) / chartArea.height;
  }
  percentage = Math.max(0, Math.min(1, percentage))

  const index = Math.round((dataSet.ymdDates.length - 1) * percentage);
  const ymdDate = dataSet.ymdDates[index];

  setGlobalState(draft => {
    draft.selectedYMDDate = ymdDate;
  })
};

export const dragger = {
  id: "dragger",

  beforeEvent(chart: Chart, args: any) {
    if (dragInfo) {
      switch (args.event.type) {
        case "mousemove":
          if (dragInfo.dragging) {
            updateSelectedYMDDate(chart, args.event)
          }
          break;

        case "mouseout":
        case "mouseup":
          dragInfo.dragging = false;
          break;

        case "mousedown":
          dragInfo.dragging = true;
          break;
      }
    } else {
      switch (args.event.type) {
        case "click":
          updateSelectedYMDDate(chart, args.event)
          break;
      }
    }
  }
};
