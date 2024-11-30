import { type FC, memo, useEffect, useState } from 'react'
import { StyledChatHeader } from './ChatHeader.styled.tsx'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Avatar, Flex } from '@/kit'
import { useNavigate } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import { getFullName } from '@/utils'
import { BACKEND_URL, USER_STATUS } from '@/constants'
import { io } from 'socket.io-client'
import { type OnlineStatusResponse } from '@/globalTypes'

interface Props {
    interlocutor: Collections.User
}

const ChatHeader: FC<Props> = ({ interlocutor }) => {
    const navigate = useNavigate()
    const [onlineStatus, setOnlineStatus] = useState(false)

    useEffect(() => {
        const socket = io(BACKEND_URL)

        const userId = interlocutor.id

        if (!userId) return

        const handleUserStatus = (data: OnlineStatusResponse): void => {
            if (data.userId === userId) {
                setOnlineStatus(!!data.data.isOnline)
            }
        }

        socket.emit(USER_STATUS, { userId })
        socket.on(USER_STATUS, handleUserStatus)

        return () => {
            socket?.off(USER_STATUS, handleUserStatus)
        }
    }, [])

    useEffect(() => {
        setOnlineStatus(!!interlocutor?.isOnline)
    }, [interlocutor.isOnline])

    return (
        <StyledChatHeader>
            <Flex gap={12}>
                <button className='back-mobile' onClick={() => { navigate(pathsConfig.chat_list) }}>
                    <ArrowLeftOutlined/>
                </button>
                <Flex alignItems='center'>
                    <Avatar
                        ava={interlocutor.ava}
                        size='ultraSmall'
                        status={onlineStatus}
                        showStatus
                    />
                    <div className='name'>
                        {getFullName(interlocutor.surname ?? '', interlocutor.name ?? '', null)}
                    </div>
                </Flex>
            </Flex>
        </StyledChatHeader>
    )
}

export default memo(ChatHeader, (prevProps, nextProps) => {
    return prevProps.interlocutor.id === nextProps.interlocutor.id
})
