import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import GroupPerformanceTable from '../../components/GroupPerformanceTable'
import { Card } from '@/kit'

const GroupPerformance: FC = () => {
	const { state } = useLocation()

	return (
		<Card title='Успеваемость группы'>
			<GroupPerformanceTable groupId={state.id} />
		</Card>
	)
}

export default GroupPerformance
