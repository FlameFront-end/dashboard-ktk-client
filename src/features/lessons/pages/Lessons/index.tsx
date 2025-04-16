import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, Typography } from 'antd'
import LessonsList from '../../components/LessonsList'

const Lessons: FC = () => {
	const { state } = useLocation()

	return (
		<Card>
			<Typography.Title level={2}>Лекции</Typography.Title>
			<LessonsList groupId={state.id} />
		</Card>
	)
}

export default Lessons
