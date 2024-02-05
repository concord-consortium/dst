import { getColorForValue } from "../helpers/colormap";
import { abbrDate } from "../helpers/format-date";
import { useDataSet } from "../hooks/use-dataset";
import { useGlobalStateContext } from "../hooks/use-global-state";

import "./colorbar-plot.css";

const ColorbarPlot = () => {
  const { dataSet } = useDataSet();
  const {globalState: {selectedMarkers, selectedYMDDate}} = useGlobalStateContext()
  const { minValue, maxValue, observations, ymdDates } = dataSet;

  const renderTable = () => {
    return selectedMarkers.map((marker) => {
      const { position } = marker;
      return (
        <table className="colorbar-table">
          <th colSpan={2}>
            {marker.position.key}
          </th>
          {[...ymdDates].reverse().map((date) => {
            const value = observations[date][position.index];
            const color = getColorForValue(value, minValue, maxValue);
            return (
              <tr>
                <td
                  style={{
                    width: "40px",
                    fontWeight: date === selectedYMDDate ? "bold" : "normal",
                    backgroundColor: date === selectedYMDDate ? "lightgray" : "white"
                  }}
                  >{abbrDate(new Date(date))}</td>
                <td
                  title={`${value}`}
                  style={{backgroundColor: color, width: "60px"}}
                />
              </tr>
            )
          })}
        </table>
      )
    });
  }

  return (
    <div className="colorbar-container">
      {renderTable()}
    </div>
  );
}

export default ColorbarPlot;