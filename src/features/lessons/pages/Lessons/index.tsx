import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from 'antd'
import LessonsList from '../../components/LessonsList'

const Lessons: FC = () => {
    const { state } = useLocation()

    return (
        <Card>
            <LessonsList groupId={state.id}/>
        </Card>
    )
}

export default Lessons
