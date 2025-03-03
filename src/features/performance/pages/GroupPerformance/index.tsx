import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from 'antd'
import GroupPerformanceTable from '../../components/GroupPerformanceTable'

const GroupPerformance: FC = () => {
    const { state } = useLocation()

    return (
        <Card>
            <GroupPerformanceTable groupId={state.id}/>
        </Card>
    )
}

export default GroupPerformance
