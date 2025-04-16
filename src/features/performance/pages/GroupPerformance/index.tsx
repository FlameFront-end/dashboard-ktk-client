import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, Typography } from 'antd'
import GroupPerformanceTable from '../../components/GroupPerformanceTable'

const GroupPerformance: FC = () => {
	const { state } = useLocation()

	return (
		<Card>
			<Typography.Title level={2}>Успеваемость группы</Typography.Title>
			<GroupPerformanceTable groupId={state.id} />
		</Card>
	)
}

export default GroupPerformance
