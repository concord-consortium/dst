import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(annotationPlugin);
import { Bar } from 'react-chartjs-2';
import { placename } from "../helpers/placename";
import { useDataSet } from "../hooks/use-dataset";
import { useGlobalStateContext } from "../hooks/use-global-state";
import { getColorForValue } from "../helpers/colormap";
import { formatDate } from '../helpers/format-date';


import "./colorbar-plot.css";

interface IDataPoint {
  x: string,
  y: [string, string]
}

interface IDataset {
  label?: string;
  data: IDataPoint[];
  backgroundColor: string;
}

const ColorbarPlot = () => {
  const { dataSet } = useDataSet();
  const {globalState: {selectedMarkers, selectedYMDDate}} = useGlobalStateContext()
  const { observations, ymdDates, placenames, minValue, maxValue, range } = dataSet;
  const labels = selectedMarkers.map((marker) => placename(marker.position, placenames))

  const yLabels = ymdDates.map((ymd) => formatDate(new Date(ymd)));
  // get next month and add to yLabels
  const nextMonth = new Date(ymdDates[ymdDates.length - 1]).getMonth() + 1;
  const year = new Date(ymdDates[ymdDates.length - 1]).getFullYear();
  const nextMonthDate = formatDate(new Date(year, nextMonth));
  yLabels.push(nextMonthDate);

  const options = {
    plugins: {
      title: {
        display: false,
        text: '',
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            const date = context[0].raw.y;
            return date[0];
          },
          label: function(context: any) {
            const ymdDate = ymdDates[context.parsed.y - 1];
            const location = selectedMarkers[context.parsed.x].position;
            const observation = observations[ymdDate][location.index];
            return `${placename(location, placenames)}: ${observation}`;
          }
        }

      },
      annotation: {
        annotations: {
          box1: {
            type: "box" as const,
            yMin: ymdDates.indexOf(selectedYMDDate!),
            yMax: ymdDates.indexOf(selectedYMDDate!) + 1,
            backgroundColor: "rgba(255, 99, 132, 0.25)"
          }
        }
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        type: 'category' as const,
        barPercentage: .5,
      },
      y: {
        reverse: true,
        type: 'category' as const,
        labels: yLabels,
      }
    },
  };

  const datasets: Array<IDataset> = [];
  const bins: Array<number> = [];
  const binSize = range / 20;
  for (let i = 0; i < 20; i++) {
    if (i === 19) {
      bins.push(maxValue)
    } else {
      bins.push(minValue + (i * binSize));
    }
  }

  bins.forEach((bin, index) => {
    const isFirstValue = index === 0;
    const lastValue = isFirstValue ? 0 : bins[index - 1];
    const label = `${Math.round(lastValue)} - ${Math.round(bin)}`;
    const data: Array<IDataPoint> = [];
    selectedMarkers.map((marker) => {
      const {position} = marker;
      ymdDates.map((date, index) => {
        const observation = observations[date][position.index] ?? 0;
        if (observation > lastValue && observation <= bin) {
          const key = placename(position, placenames);
          if (index !== ymdDates.length) {
            const startValue = formatDate(new Date(date));
            const endValue = formatDate(new Date(yLabels[index + 1]));
            data.push({x: key, y: [startValue, endValue]});
          }
        }
      })
    })
    if (data.length) {
      datasets.push({
        label,
        data,
        backgroundColor: getColorForValue(bin, bins[0], bins[bins.length - 1])

      });
    }
  });


  return (
    <div className="colorbar-container">
      <Bar options={options} data={{labels, datasets}}/>
    </div>
  );
}

export default ColorbarPlot;

