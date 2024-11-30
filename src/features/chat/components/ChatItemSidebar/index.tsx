import { type Dispatch, type FC, type SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAppSelector, useWindowWidth } from '@/hooks'
import { Avatar, Flex } from '@/kit'
import { getFullName } from '@/utils'
import { BACKEND_URL, USER_STATUS } from '@/constants'
import { type OnlineStatusResponse } from '@/globalTypes'
import { pathsConfig } from '@/pathsConfig'
import { StyledChatItemSidebarWrapper } from './ChatItemSidebar.styled.tsx'

interface Props {
    chat: Collections.Chat
    isActive: boolean
    setActiveChatId: Dispatch<SetStateAction<number>>
    isLastItem: boolean
}

const ChatItemSidebar: FC<Props> = ({ chat, isActive, setActiveChatId, isLastItem }) => {
    const navigate = useNavigate()
    const windowWidth = useWindowWidth()
    const user = useAppSelector(state => state.auth.user)

    const [onlineStatus, setOnlineStatus] = useState(false)

    const handleClick = (): void => {
        if (windowWidth >= 800) {
            setActiveChatId(chat.id)
        } else {
            navigate(pathsConfig.chat, { state: { senderId: user.id, userId: chat.interlocutor?.id, chatId: chat.id } })
        }
    }

    useEffect(() => {
        const socket = io(BACKEND_URL, {
            query: {
                userId: user.id
            }
        })

        const userId = chat.interlocutor?.id

        if (!userId) return

        const handleUserStatus = (data: OnlineStatusResponse): void => {
            if (data.userId === userId) {
                setOnlineStatus(!!data.data.isOnline)
            }
        }

        // const handleUpdateChat = (data: Collections.Chat): void => {
        //     setOnlineStatus(!!data.data.isOnline)
        // }

        socket.emit(USER_STATUS, { userId })
        socket.on(USER_STATUS, handleUserStatus)
        // socket.on(USER_STATUS, handleUpdateChat)

        return () => {
            socket?.off(USER_STATUS, handleUserStatus)
            socket?.disconnect()
        }
    }, [chat.interlocutor?.id, chat.id])

    return (
        <StyledChatItemSidebarWrapper className={(isActive ? 'active ' : '') + (isLastItem ? 'last' : '') } onClick={handleClick}>
            <Flex alignItems='center'>
                <Avatar
                    ava={chat?.interlocutor?.ava}
                    size='small'
                    status={onlineStatus}
                    showStatus
                />
                <Flex direction='column'>
                    <div className='full_name'>
                        {getFullName(chat?.interlocutor?.surname ?? '', chat.interlocutor?.name ?? '', null)}
                    </div>
                    {chat.lastMessage !== null && <div className='last_message'>
                        <strong>{chat.lastSenderId === user.id ? 'Вы' : chat.lastSenderName}: </strong>
                        {chat.lastMessage}
                    </div>}
                </Flex>
            </Flex>
            {!isActive && chat.unreadCount > 0 && <div className='unread-count'>{chat.unreadCount}</div>}
        </StyledChatItemSidebarWrapper>
    )
}

export default ChatItemSidebar
