import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(annotationPlugin);
import { Bar } from 'react-chartjs-2';
import { placename } from "../helpers/placename";
import { useDataSet } from "../hooks/use-dataset";
import { useGlobalStateContext } from "../hooks/use-global-state";
import { formatDate, toDateUTC } from '../helpers/format-date';
import { dynamicRound } from '../helpers/dynamic-round';
import { useColorBins } from '../hooks/use-color-bins';
import { dragger, startAnnotationDragListener, stopAnnotationDragListener } from '../plugins/dragger';

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
  const { bins } = useColorBins();
  const {globalState: {selectedMarkers, selectedYMDDate}} = useGlobalStateContext()
  const { observations, ymdDates, placenames, info } = dataSet;
  const labels = selectedMarkers.map((marker) => placename(marker.position, placenames))
  const yLabels = ymdDates.map((ymd) => formatDate(new Date(ymd)));
  // get next month and add to yLabels
  const lastDateMonth = toDateUTC(ymdDates[ymdDates.length - 1]).getMonth() + 1;
  const lastDateYear = toDateUTC(ymdDates[ymdDates.length - 1]).getFullYear();
  const lastDate = formatDate(new Date(lastDateYear, lastDateMonth));
  yLabels.push(lastDate);

  // note: any is used here as the Bar type doesn't support the `events:` list but the code does
  const options: any = {
    animation: {
      duration: 0,
    },
    dragDirection: "upDown",
    events: ['mousedown', 'mouseup', 'mousemove', 'mouseout', 'click'],
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
            const value = observations[ymdDate][location.index];
            const observation = value ? value : 0
            return `${placename(location, placenames)}: ${dynamicRound(observation)} ${info.units}`;
          }
        }
      },
      annotation: {
        enter() {
          startAnnotationDragListener();
        },
        leave() {
          stopAnnotationDragListener();
        },
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

  const datasets: IDataset[] = [];

  bins.forEach((bin, index) => {
    const isFirstValue = index === 0;
    const lastValue = isFirstValue ? 0 : bins[index - 1].value;
    const data: Array<IDataPoint> = [];
    selectedMarkers.map((marker) => {
      const {position} = marker;
      ymdDates.map((date, index) => {
        const observation = observations[date][position.index] ?? 0;
        if (observation > lastValue && observation <= bin.value) {
          const key = placename(position, placenames);
          const startValue = formatDate(toDateUTC(date));
          const endValue = yLabels[index + 1];
          data.push({x: key, y: [startValue, endValue]});
        }
      })
    })
    if (data.length) {
      datasets.push({
        data,
        backgroundColor: bin.color
      });
    }
  });

  return (
    <div className="colorbar-container">
      <Bar plugins={[dragger]} options={options} data={{labels, datasets}}/>
    </div>
  );
}

export default ColorbarPlot;

