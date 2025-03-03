import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from 'antd'

const IndividualPerformance: FC = () => {
    const { state } = useLocation()

    return (
        <Card>
            {state.id}
        </Card>
    )
}

export default IndividualPerformance
