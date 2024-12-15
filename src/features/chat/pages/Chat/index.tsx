import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react'
import { Input, List, Avatar, Button } from 'antd'
import { io, type Socket } from 'socket.io-client'
import { SendOutlined } from '@ant-design/icons'
import { BACKEND_URL } from '@/constants'
import { chatActions, fetchChatInfo } from '../../store/chat.slice.ts'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { useLocation } from 'react-router-dom'
import { StyledChatWrapper } from './Chat.styled.tsx'

const Chat: FC = () => {
    const { state } = useLocation()
    const chatId: string = state.id

    const userId = useAppSelector((state) => state.auth.user.id)
    const userRole = useAppSelector((state) => state.auth.user.role)
    const userName = useAppSelector((state) => state.auth.user.name)

    const dispatch = useAppDispatch()
    const chat = useAppSelector((state) => state.chat)

    const [newMessage, setNewMessage] = useState('')
    const socketRef = useRef<Socket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setNewMessage(e.target.value)
    }

    const sendMessage = (): void => {
        if (newMessage.trim() === '' || !chatId) return

        const messageData = {
            chatId,
            message: newMessage,
            userId,
            senderType: userRole,
            senderName: userName
        }

        socketRef.current?.emit('sendMessage', messageData)
        setNewMessage('')
    }

    const handleNewMessage = (message: Collections.Message): void => {
        dispatch(chatActions.addMessage(message))
    }

    useEffect(() => {
        const socket = io(BACKEND_URL, { query: { userId } })
        socketRef.current = socket

        const fetch = async (): Promise<void> => {
            if (chatId) {
                await dispatch(fetchChatInfo({ chatId }))
            }
        }

        void fetch()

        socket.on('newMessage', handleNewMessage)

        return () => {
            socket.off('newMessage', handleNewMessage)
            socket.emit('leaveRoom', { chatId })
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chat.messages])

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current?.emit('joinRoom', { chatId })
        }

        return () => {
            socketRef.current?.emit('leaveRoom', { chatId })
        }
    }, [socketRef.current, chatId])

    return (
        <StyledChatWrapper>
            <List
                className="message-list"
                itemLayout="horizontal"
                dataSource={chat.messages}
                renderItem={(item) => {
                    if (item.teacherSender) {
                        return (
                            <List.Item className={item.teacherSender.id === userId ? 'message-right' : 'message-left'}>
                                <List.Item.Meta
                                    avatar={<Avatar>{item.teacherSender.name.charAt(0)}</Avatar>}
                                    title={item.teacherSender.name}
                                    description={item.text}
                                />
                            </List.Item>
                        )
                    } else if (item.studentSender) {
                        return (
                            <List.Item className={item.studentSender.id === userId ? 'message-right' : 'message-left'}>
                                <List.Item.Meta
                                    avatar={<Avatar>{item.studentSender.name.charAt(0)}</Avatar>}
                                    title={item.studentSender.name}
                                    description={item.text}
                                />
                            </List.Item>
                        )
                    }
                }}
            />
            <div className="chat-input-area" >
                <Input
                    className="chat-input"
                    value={newMessage}
                    onChange={handleMessageChange}
                    placeholder="Введите сообщение"
                    onPressEnter={sendMessage}
                />
                <Button className="send-button" type="primary" icon={<SendOutlined />} onClick={sendMessage} />
            </div>
            <div ref={messagesEndRef} />
        </StyledChatWrapper>
    )
}

export default Chat
