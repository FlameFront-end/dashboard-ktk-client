import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from 'antd'
import GradesChart from '../../components/GradesChart'

interface Grade {
    id: string
    grade: string
    date: string
}

type SubjectGrades = Record<string, Grade[]>

const IndividualPerformance: FC = () => {
    const { state } = useLocation()

    const gradesData: SubjectGrades[] = [
        {
            'Front-end разработка': [
                { id: '1', grade: '2', date: '2024-12-15' },
                { id: '2', grade: '3', date: '2024-12-16' },
                { id: '3', grade: '5', date: '2024-12-17' }
            ]
        }
    ]

    return (
        <Card>
            {state.id}
            {gradesData.map((item, index) => (
                <GradesChart key={index} data={item} />
            ))}
        </Card>
    )
}

export default IndividualPerformance
