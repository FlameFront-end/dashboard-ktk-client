import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, Tabs } from 'antd'
import GradesChart from '../../components/GradesChart'
import { useGetAllGradesFromStudentQuery } from '../../api/performance.api.ts'

const IndividualPerformance: FC = () => {
    const { state } = useLocation()
    const { data: gradesData } = useGetAllGradesFromStudentQuery(state.id)

    return (
        <Card>
            {gradesData && (
                <Tabs
                    items={gradesData
                        .map((item, index) => ({
                            key: `${index}`,
                            label: item.discipline,
                            children: <GradesChart key={index} data={item} />
                        }))}
                />
            )}
        </Card>
    )
}

export default IndividualPerformance
