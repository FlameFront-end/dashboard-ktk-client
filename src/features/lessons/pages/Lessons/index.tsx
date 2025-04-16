import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import LessonsList from '../../components/LessonsList'
import { Card } from '@/kit'

const Lessons: FC = () => {
	const { state } = useLocation()

	return (
		<Card title='Лекции'>
			<LessonsList groupId={state.id} />
		</Card>
	)
}

export default Lessons
