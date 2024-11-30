import { type FC, type MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { List } from 'antd'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { chatActions, fetchChatInfo } from '../../store/chat.slice.ts'
import { StyledChatWrapper } from './Chat.styled.tsx'
import { BACKEND_URL, RECEIVE_MESSAGE } from '@/constants'
import { Flex } from '@/kit'
import Message from '../Message'
import ChatBottom from '../ChatBottom'
import { io } from 'socket.io-client'
import ChatHeader from '../ChatHeader'

interface Props {
    chatId: number
}

const Chat: FC<Props> = ({ chatId }) => {
    const dispatch = useAppDispatch()
    const userId = useAppSelector(state => state.auth.user.id)
    const chat = useAppSelector((state) => state.chat)

    const [replyToMessage, setReplyToMessage] = useState<Collections.Message | null>(null)
    const [selectedMessages, setSelectedMessages] = useState<Collections.Message[]>([])
    const [scrollPosition, setScrollPosition] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const wrapper: MutableRefObject<HTMLDivElement | null> = useRef(null)

    const handleSelectMessage = (message: Collections.Message): void => {
        setSelectedMessages((prevMessages) => {
            const isAlreadySelected = prevMessages.some((msg) => msg.id === message.id)

            if (isAlreadySelected) {
                return prevMessages.filter((msg) => msg.id !== message.id)
            } else {
                return [...prevMessages, message]
            }
        })
    }

    const handleScroll = useCallback((): void => {
        const list = wrapper.current?.querySelector('.list')

        if (list) {
            const scrollHeight = list.scrollHeight
            const scrollTop = list.scrollTop
            const clientHeight = list.clientHeight
            const maxScrollPosition = scrollHeight - clientHeight

            const newScrollPosition = maxScrollPosition - scrollTop

            setScrollPosition(newScrollPosition)
        }
    }, [])

    const scrollToBottom = useCallback((behavior: 'smooth' | 'auto'): void => {
        const list = wrapper.current?.querySelector('.list')
        list?.scrollTo({ top: list.scrollHeight, behavior })
    }, [])

    useEffect(() => {
        return () => {
            setReplyToMessage(null)
        }
    }, [chatId])

    useEffect(() => {
        const socket = io(BACKEND_URL, {
            query: { userId }
        })

        const fetch = async (): Promise<void> => {
            if (chatId) {
                setIsLoading(true)
                await dispatch(fetchChatInfo({ chatId, userId: userId ?? 0 })).then(() => {
                    setIsLoading(false)
                })
            }
        }

        void fetch()

        socket.on(RECEIVE_MESSAGE, (message: Collections.Message) => {
            if (message.chatId === chatId) {
                dispatch(chatActions.addMessage(message))
            }
        })

        return () => {
            socket.disconnect()
            // socket.off(RECEIVE_MESSAGE)
        }
    }, [dispatch, userId, chatId])

    useEffect(() => {
        const list = wrapper.current?.querySelector('.list')
        list?.addEventListener('scroll', handleScroll)

        return () => {
            list?.removeEventListener('scroll', handleScroll)
        }
    }, [wrapper?.current])

    useEffect(() => {
        if (wrapper?.current && chat.messages.length) {
            scrollToBottom('auto')
        }
    }, [wrapper?.current, chat.messages?.length])

    const memoizedMessages = useMemo(() => {
        return chat.messages.map((message) => (
            <Message key={message.id} message={message} handleSelectMessage={handleSelectMessage} selectedMessages={selectedMessages}/>
        ))
    }, [chatId, chat.messages, handleSelectMessage, selectedMessages])

    return (
        <StyledChatWrapper>
            {chat.interlocutor !== null && <ChatHeader interlocutor={chat.interlocutor}/>}
            {chatId !== null ? <>
                <Flex direction="column" justifyContent="space-between" className='wrapper-chat' ref={wrapper}>
                    <List
                        className='list'
                        loading={isLoading}
                        dataSource={chat.messages}
                        renderItem={() => null}
                    >
                        {memoizedMessages}
                    </List>

                    {/* <VideoChat receiverId={chat.interlocutor?.id ?? 0} userId={userId}/> */}
                    <ChatBottom
                        chatId={chatId}
                        receiverId={chat.interlocutor?.id ?? 0}
                        setReplyToMessage={setReplyToMessage}
                        replyToMessage={replyToMessage}
                        scrollToBottom={scrollToBottom}
                        selectedMessages={selectedMessages}
                        setSelectedMessages={setSelectedMessages}
                    />
                </Flex>

                {scrollPosition > 600 && (
                    <button onClick={() => { scrollToBottom('smooth') }} className='btn scroll-btn'/>
                )}
            </> : <div className='no_select_chat'><h3>Выберите кому <br/> вы хотите написать</h3></div>}
        </StyledChatWrapper>
    )
}

export default Chat
