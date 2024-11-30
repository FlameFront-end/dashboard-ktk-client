import { useEffect, useState, useRef, type FC } from 'react'
import dayjs from 'dayjs'
import { StyledMessage } from './Message.styled.tsx'
import { Avatar, Flex } from '@/kit'
import { io, type Socket } from 'socket.io-client'
import { BACKEND_URL, MESSAGE_READ } from '@/constants'
import { useAppSelector } from '@/hooks'
import { CheckOutlined } from '@ant-design/icons'
import Audio from '../../../kit/components/Audio'

interface Props {
    message: Collections.Message
    handleSelectMessage: (message: Collections.Message) => void
    selectedMessages: Collections.Message[]
}

const Message: FC<Props> = ({ message, handleSelectMessage, selectedMessages }) => {
    const userId = useAppSelector(state => state.auth.user.id)
    const [isRead, setIsRead] = useState(message.isRead)
    const messageRef = useRef<HTMLDivElement | null>(null)
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        setIsRead(message.isRead)
    }, [message])

    useEffect(() => {
        socketRef.current = io(BACKEND_URL)
    }, [])

    useEffect(() => {
        const socket = socketRef.current

        const handleMessageReadUpdate = (updatedMessage: any): void => {
            if (!message.isRead) {
                if (updatedMessage.id === message.id) {
                    setIsRead(updatedMessage.isRead)
                }
            }
        }

        if (socket) {
            socket.on(MESSAGE_READ, handleMessageReadUpdate)

            const handleIntersection = ([entry]: IntersectionObserverEntry[]): void => {
                if (entry.isIntersecting && !isRead && message.receiverId === userId) {
                    socket.emit(MESSAGE_READ, {
                        messageId: message.id,
                        receiverId: message.receiverId,
                        senderId: message.senderId
                    })
                }
            }

            const observer = new IntersectionObserver(handleIntersection)
            if (messageRef.current) {
                observer.observe(messageRef.current)
            }

            return () => {
                observer.disconnect()
                socket.off(MESSAGE_READ)
            }
        }
    }, [isRead, message.id, message.receiverId, userId])

    return (
        <StyledMessage
            ref={messageRef}
            key={message.id}
            className={selectedMessages.some((msg) => msg.id === message.id) ? 'active' : ''}
            onClick={() => { handleSelectMessage(message) }}
        >
            <Flex className='wrapper' justifyContent='start'>
                <Avatar size='small' ava={message.sender.ava} />

                <div className='full-width'>
                    <Flex alignItems='center' justifyContent='space-between'>
                        <Flex alignItems='center'>
                            <div className='nick'>{message.sender.name}</div>

                            {message.senderId === userId && <div className="marks-read">
                                {isRead ? <><CheckOutlined color='#bae0ff'/> <CheckOutlined className='last'/></>
                                    : <CheckOutlined/>}
                            </div>}
                        </Flex>
                        <div className='time'>{dayjs(message.createdAt)?.format('HH:mm')}</div>
                    </Flex>

                    {message.replyToMessageId != null ? (
                        <Flex direction="column" className='reply-message'>
                            <Flex>
                                <div className="separator"/>
                                <Flex direction='column' gap={0}>
                                    <div className='author'>{message.replyToMessage?.sender.name}</div>
                                    {message.replyToMessage?.content && <div className='message'>{message.replyToMessage?.content}</div>}
                                    {message.replyToMessage?.audioUrl && (
                                        <div className='audio-controls'>
                                            <audio className='audio-player' src={message.replyToMessage?.audioUrl}></audio>
                                        </div>
                                    )}
                                </Flex>
                            </Flex>
                        </Flex>
                    ) : null}

                    <Flex direction="column">
                        {message.content && <div className='message'>{message.content}</div>}
                        {message.audioUrl && <div className='audio-controls'>
                            <Audio url={message.audioUrl} id={message.id}/>
                        </div>}
                    </Flex>
                </div>
            </Flex>
        </StyledMessage>
    )
}

export default Message
