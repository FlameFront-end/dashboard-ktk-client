import { Typography } from 'antd'
import { type FC } from 'react'
import { Flex } from '@/kit'
import { StyledHeaderWrapper } from './Header.styled.tsx'
import { useAppSelector } from '@/hooks'

const roles = {
    teacher: 'учитель',
    admin: 'администатор',
    student: 'студент'
}

const Header: FC = () => {
    const user = useAppSelector(state => state.auth.user)

    return (
        <StyledHeaderWrapper style={{ padding: '20px', backgroundColor: '#141414' }}>
            <Flex alignItems='center' justifyContent='end'>
                {(user.name && user.role) && (
                    <>
                        <Typography.Title level={4} style={{ marginTop: '0px' }}>ФИО: {user.name},</Typography.Title>
                        <Typography.Title level={4} style={{ marginTop: '0px' }}>Роль: {roles[user.role]}</Typography.Title>
                    </>
                )}
            </Flex>
        </StyledHeaderWrapper>
    )
}

export default Header
