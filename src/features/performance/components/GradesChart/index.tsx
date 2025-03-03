import { type FC } from 'react'
import { StyledGradesChartWrapper } from './GradesChart.styled.tsx'
import LineChart from '../Charts/LineChart'
import PieChart from '../Charts/PieChart'

interface Grade {
    id: string
    grade: string
    date: string
}

type SubjectGrades = Record<string, Grade[]>

interface Props {
    data: SubjectGrades
}

const GradesChart: FC<Props> = ({ data }) => {
    const grades = Object.values(data)[0]

    return (
        <StyledGradesChartWrapper>
            <div className='item'>
                <LineChart data={grades} />
            </div>

            <div className='item'>
                <PieChart data={grades} />
            </div>
        </StyledGradesChartWrapper>
    )
}

export default GradesChart
