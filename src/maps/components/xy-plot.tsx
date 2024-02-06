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
import { formatDate } from '../helpers/format-date';
import { useDataSet } from '../hooks/use-dataset';
import { useGlobalStateContext } from '../hooks/use-global-state';
import { Line } from 'react-chartjs-2'

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
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

function XYPlot() {
  const { dataSet: { ymdDates, observations } } = useDataSet()
  const {globalState: {selectedMarkers, selectedYMDDate}} = useGlobalStateContext()
  const labels = ymdDates.map(ymdDate => formatDate(new Date(ymdDate)))
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
      plugins: {
        ...options.plugins,
        title: {
          display: true,
          text: `Observations for ${formatDate(new Date(selectedYMDDate))}`
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
    const data = Object.keys(observations).map(key => observations[key][position.index])
    return {
      label: position.key,
      data,
      borderColor: color,
      backgroundColor: color,
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