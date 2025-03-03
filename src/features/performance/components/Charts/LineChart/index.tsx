import { type FC } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

interface Grade {
    id: string
    grade: string
    date: string
}

interface LineChartProps {
    data: Grade[]
}

const LineChart: FC<LineChartProps> = ({ data }) => {
    let totalSum = 0
    let totalCount = 0

    const sortedGrades = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const cumulativeData = sortedGrades.map(({ date, grade }) => {
        totalSum += Number(grade)
        totalCount++
        return { date, avgGrade: totalSum / totalCount }
    })

    const chartData = {
        labels: cumulativeData.map(d => d.date),
        datasets: [
            {
                label: 'Средняя оценка',
                data: cumulativeData.map(d => d.avgGrade),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.4
            }
        ]
    }

    const options = {
        responsive: true,
        plugins:
          { legend: { display: true } }
    }

    return <Line data={chartData} options={options} className='line' />
}

export default LineChart
