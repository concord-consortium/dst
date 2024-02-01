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
  ChartDataset,
} from 'chart.js'

import { Line } from 'react-chartjs-2'

import "./xy-plot.css"
import { formatDate } from '../helpers/format-date';
import { useDataSet } from '../hooks/use-dataset';
import { useGlobalStateContext } from '../hooks/use-global-state';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
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
  const { dataSet: { info, ymdDates, observations } } = useDataSet()
  const {globalState: {selectedPositions: selectedNumericPositions}} = useGlobalStateContext()
  const labels = ymdDates.map(ymdDate => formatDate(new Date(ymdDate)))

  const datasets: ChartDataset<"line", number[]>[] = selectedNumericPositions.map(np => {
    const data = Object.keys(observations).map(ymd => observations[ymd][np.numericPosition.index])
    return {
      label: np.numericPosition.key,
      data,
      borderColor: np.color,
      backgroundColor: np.color,
    }
  })

  const data: ChartData<"line", number[], string> = {
    labels,
    datasets,
  };

  options.plugins.title.text = `${info.observationName} from ${labels[0]} to ${labels[labels.length - 1]}`

  return (
    <div className='xy-plot'>
      <Line options={options} data={data} />
    </div>
  )
}

export default XYPlot