import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from 'antd'
import PerformanceTable from '../../components/PerformanceTable'

const Performance: FC = () => {
    const { state } = useLocation()

    return (
        <Card>
            <PerformanceTable groupId={state.id}/>
        </Card>
    )
}

export default Performance
