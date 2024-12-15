import { useState, useEffect, useRef, type FC, type ChangeEvent } from 'react'
import { Input, List, Avatar } from 'antd'
import { io, type Socket } from 'socket.io-client'
import { BACKEND_URL } from '@/constants'
import { chatActions, fetchChatInfo } from '../../store/chat.slice.ts'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { useLocation } from 'react-router-dom'

const Chat: FC = () => {
    const { state } = useLocation()
    const chatId: string = state.id

    const userId = useAppSelector((state) => state.auth.user.id)
    const dispatch = useAppDispatch()
    const chat = useAppSelector((state) => state.chat)

    const [newMessage, setNewMessage] = useState('')
    const socketRef = useRef<Socket | null>(null)

    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setNewMessage(e.target.value)
    }

    const sendMessage = (): void => {
        if (newMessage.trim() === '' || !chatId) return
        socketRef.current?.emit('sendMessage', { chatId, message: newMessage, userId })
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
        if (socketRef.current) {
            socketRef.current?.emit('joinRoom', { chatId })
        }

        return () => {
            socketRef.current?.emit('leaveRoom', { chatId })
        }
    }, [socketRef.current])

    return (
        <div>
            <Input.Search
                value={newMessage}
                onChange={handleMessageChange}
                placeholder="Введите сообщение"
                enterButton="Отпправить"
                onSearch={sendMessage}
            />
            <List
                itemLayout="horizontal"
                dataSource={chat.messages}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar>{item.sender.name.charAt(0)}</Avatar>}
                            title={item.sender.name}
                            description={item.text}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default Chat
