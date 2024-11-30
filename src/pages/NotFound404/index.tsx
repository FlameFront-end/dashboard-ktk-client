import { type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'
import { Flex } from '@/kit'

const NotFound404: FC = () => {
    const navigate = useNavigate()

    const goBack = (): void => {
        navigate(-1)
    }

    return (
        <Flex alignItems={'center'} justifyContent={'center'} style={{ width: '100vw', height: '100vh' }}>
            <Result
                status='404'
                title='404'
                subTitle='Unfortunately, the page you visited does not exist.'
                extra={
                    <Button type='primary' onClick={goBack}>
                        Go back
                    </Button>
                }
            />
        </Flex>
    )
}

export default NotFound404
