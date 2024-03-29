
import { useColorBins } from "../hooks/use-color-bins";
import { useDataSet } from "../hooks/use-dataset";
import "./map-legend.css";

const MapLegend = () => {
  const { bins } = useColorBins();
  const { dataSet } = useDataSet();
  const { info } = dataSet;

  return (
    <div className="map-legend">
      <div className="legend-title">{info.observationName} ({info.units})</div>
      <div className="table-container">
        <table>
          <tbody>
            {bins.map((bin, index) => {
              if (index < 10) {
                return (
                  <tr key={index}>
                    <td className={"color"} style={{ backgroundColor: bin.color }}></td>
                    <td className={"label"}>{bin.label}</td>
                    <td className="color" style={{backgroundColor: bins[index + 10].color}}></td>
                    <td className={"label"}>{bins[index + 10].label}</td>
                  </tr>
                )
              }

            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MapLegend;