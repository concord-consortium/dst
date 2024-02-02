import { getColorForValue } from "../helpers/colormap";
import { abbrDate } from "../helpers/format-date";
import { useDataSet } from "../hooks/use-dataset";
import { useGlobalStateContext } from "../hooks/use-global-state";

import "./colorbar-plot.css";

const ColorbarPlot = () => {
  const { dataSet } = useDataSet();
  const {globalState: {selectedMarkers, selectedYMDDate}} = useGlobalStateContext()
  const { minValue, maxValue, observations } = dataSet;

  const renderTable = () => {
    return selectedMarkers.map((marker) => {
      const { position } = marker;
      return (
        <table className="colorbar-table">
          <th colSpan={2}>
            {marker.position.key}
          </th>
          {[...Object.keys(observations)].reverse().map((key) => {
            const value = observations[key][position.index];
            const color = getColorForValue(value, minValue, maxValue);
            return (
              <tr>
                <td
                  style={{
                    width: "40px",
                    fontWeight: key === selectedYMDDate ? "bold" : "normal",
                    backgroundColor: key === selectedYMDDate ? "lightgray" : "white"
                  }}
                  >{abbrDate(new Date(key))}</td>
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