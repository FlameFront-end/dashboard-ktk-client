import { type FC } from 'react'
import { useLocation } from 'react-router-dom'

const AdminDashboard: FC = () => {
    const { state } = useLocation()

    console.log('id', state.id)

    return (
        <>

        </>
    )
}

export default AdminDashboard
