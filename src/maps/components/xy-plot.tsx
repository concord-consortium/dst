import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartDataset
} from 'chart.js'
import annotationPlugin from "chartjs-plugin-annotation";
ChartJS.register(annotationPlugin);
import { formatDate, toDateUTC } from '../helpers/format-date';
import { useDataSet } from '../hooks/use-dataset';
import { useGlobalStateContext } from '../hooks/use-global-state';
import { Line } from 'react-chartjs-2'
import { placename } from '../helpers/placename';
import { dynamicRound } from '../helpers/dynamic-round';
import { hexToRGBA } from '../helpers/color-helpers';

import "./xy-plot.css"


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
};

function XYPlot() {
  const { dataSet: { info, ymdDates, observations, placenames } } = useDataSet()
  const {globalState: {selectedMarkers, selectedYMDDate}} = useGlobalStateContext()
  const labels = ymdDates.map(ymdDate => formatDate(toDateUTC(ymdDate)))
  const [chartOptions, setChartOptions] = useState(options)

  useEffect(() => {
    if (selectedYMDDate === undefined) {
      return
    }
    const isFirstDate = selectedYMDDate === ymdDates[0];
    const isLastDate = selectedYMDDate === ymdDates[ymdDates.length - 1];
    const xMin = isLastDate ? ymdDates.length - 1.5 : isFirstDate ? ymdDates.indexOf(selectedYMDDate) : ymdDates.indexOf(selectedYMDDate!) - .5;
    const xMax = isLastDate ? ymdDates.length - 1 : ymdDates.indexOf(selectedYMDDate) + .5;
    const newOptions = {
      ...options,
      scales: {
        y: {
          title: {
            display: true,
            text: info.observationName + " (" + info.units + ")"
          }
        }
      },
      plugins: {
        ...options.plugins,
        title: {
          display: false,
          text: `${info.observationName} from ${labels[0]} to ${labels[labels.length - 1]}`
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const placename = context.dataset.label;
              const observation = context.parsed.y ? context.parsed.y : 0;
              return `${placename}: ${dynamicRound(observation)} ${info.units}`;
            }
          }
        },
        annotation: {
          annotations: {
            box1: {
              type: "box",
              xMin,
              xMax,
              backgroundColor: "rgba(255, 99, 132, 0.25)"
            }
          }
        }
      },
    }
    setChartOptions(newOptions)
  }, [selectedYMDDate])

  const datasets: ChartDataset<"line", number[]>[] = selectedMarkers.map(marker => {
    const {position, color} = marker
    const data = Object.keys(observations).map(key => observations[key][position.index] ?? 0)
    const label = placename(position, placenames)
    return {
      label,
      data,
      borderColor: hexToRGBA(color, .5),
      backgroundColor: `#${color}`,
      borderWidth: 2,
      pointRadius: 2
    }
  })

  const data: ChartData<"line", number[], string> = {
    labels,
    datasets,
  };

  return (
    <div className='xy-plot'>
      <Line options={chartOptions} data={data} />
    </div>
  )
}

export default XYPlot