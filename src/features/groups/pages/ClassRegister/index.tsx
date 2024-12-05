import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from 'antd'
import ClassRegisterTable from '../../components/ClassRegisterTable'

const ClassRegister: FC = () => {
    const { state } = useLocation()

    return (
        <Card>
            <ClassRegisterTable groupId={state.id}/>
        </Card>
    )
}

export default ClassRegister
