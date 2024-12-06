import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from 'antd'
import LessonsTable from '../../components/LessonsTable'

const Lessons: FC = () => {
    const { state } = useLocation()

    return (
        <Card>
            <LessonsTable groupId={state.id}/>
        </Card>
    )
}

export default Lessons
