import {
    type Dispatch,
    type FC,
    type SetStateAction,
    type ChangeEvent,
    useEffect,
    useRef,
    useState,
    memo
} from 'react'
import { StyledChatBottom } from './ChatBottom.styled.tsx'
import { AudioMutedOutlined, AudioOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { AccentButton, Flex } from '@/kit'
import { io, type Socket } from 'socket.io-client'
import { useAppSelector } from '@/hooks'
import { BACKEND_URL, SEND_MESSAGE, TYPING, TYPING_STOPPER } from '@/constants'
import { type TypingMessageResponse } from '@/globalTypes'

interface Props {
    chatId: number
    receiverId: number
    replyToMessage: Collections.Message | null
    setReplyToMessage: Dispatch<SetStateAction<Collections.Message | null>>
    selectedMessages: Collections.Message[]
    setSelectedMessages: Dispatch<SetStateAction<Collections.Message[]>>
    scrollToBottom: (behavior: 'smooth' | 'auto') => void
}

interface Emoji {
    native: string
}

const ChatBottom: FC<Props> = ({
    chatId,
    receiverId,
    replyToMessage,
    setReplyToMessage,
    scrollToBottom,
    selectedMessages,
    setSelectedMessages
}) => {
    const userId = useAppSelector(state => state.auth.user.id)

    const [content, setContent] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [typingUserName, setTypingUserName] = useState<string | null>(null)
    const [typingUserId, setTypingUserId] = useState<number | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const socketRef = useRef<Socket | null>(null)
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

    const notifyTyping = (): void => {
        if (socketRef.current && content) {
            socketRef.current.emit(TYPING, { chatId, senderId: userId })
        }
    }

    const notifyTypingStopped = (): void => {
        if (socketRef.current) {
            socketRef.current.emit(TYPING_STOPPER, { chatId, senderId: userId })
        }
    }

    const startRecording = (): void => {
        setIsRecording(true)
        void navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            const chunks: Blob[] = []

            mediaRecorder.addEventListener('dataavailable', (event) => {
                chunks.push(event.data)
            })

            mediaRecorder.addEventListener('stop', () => {
                const blob = new Blob(chunks, { type: 'audio/webm' })
                setAudioBlob(blob)
            })

            mediaRecorder.start()
        })
    }

    const stopRecording = (): void => {
        setIsRecording(false)
        if (mediaRecorderRef.current != null) {
            mediaRecorderRef.current.stop()
        }
    }

    const sendMessage = (): void => {
        notifyTypingStopped()

        if (audioBlob != null) {
            void audioBlob.arrayBuffer().then((arrayBuffer) => {
                socketRef.current?.emit(SEND_MESSAGE, {
                    audio: arrayBuffer,
                    senderId: userId,
                    chatId,
                    receiverId,
                    content: content.trim() !== '' ? content : null,
                    replyToMessageId: replyToMessage?.id
                })
            }).then(() => {
                setAudioUrl(null)
                setAudioBlob(null)
                setContent('')
                setReplyToMessage(null)
                scrollToBottom('smooth')
            })
        } else if (content.trim() !== '') {
            socketRef.current?.emit(SEND_MESSAGE, {
                chatId,
                content,
                senderId: userId,
                receiverId,
                replyToMessageId: replyToMessage?.id
            })
            setContent('')
            setReplyToMessage(null)
            scrollToBottom('smooth')
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setContent(e.target.value)
        notifyTyping()

        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current)
        }

        typingTimerRef.current = setTimeout(() => {
            notifyTypingStopped()
        }, 3000)
    }

    const getMessageCountText = (count: number): string => {
        if (count === 1) {
            return `Выбрано ${count} сообщение`
        } else if (count > 1 && count < 5) {
            return `Выбраны ${count} сообщения`
        } else {
            return `Выбраны ${count} сообщений`
        }
    }

    const handleClickReply = (): void => {
        setReplyToMessage(selectedMessages[0])
        setSelectedMessages([])
    }

    useEffect(() => {
        socketRef.current = io(BACKEND_URL)

        return () => {
            socketRef.current?.disconnect()
            if (typingTimerRef.current) {
                clearTimeout(typingTimerRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (audioBlob != null) {
            const url = URL.createObjectURL(audioBlob)
            setAudioUrl(url)
        }
    }, [audioBlob])

    useEffect(() => {
        socketRef.current?.on(TYPING, (data: TypingMessageResponse) => {
            if (data.chatId === chatId) {
                setTypingUserName(data.senderName)
                setTypingUserId(data.senderId)
            }
        })

        socketRef.current?.on(TYPING_STOPPER, () => {
            setTypingUserName(null)
            setTypingUserId(null)
        })

        return () => {
            socketRef.current?.off(TYPING)
            socketRef.current?.off(TYPING_STOPPER)

            setTypingUserName(null)
            setTypingUserId(null)
        }
    }, [chatId])

    return (
        <StyledChatBottom direction='column'>
            {(replyToMessage != null) && (
                <Flex justifyContent='space-between' alignItems='center' className='reply'>
                    <Flex>
                        <div className="separator" />
                        <Flex direction='column' gap={0}>
                            <div className='author'>{replyToMessage.sender.name} {replyToMessage.sender.surname}</div>
                            {replyToMessage.content !== null && <div>{replyToMessage.content}</div>}
                            {replyToMessage.audioUrl !== null && <div>Голосовое сообщение</div>}
                        </Flex>
                    </Flex>
                    <button onClick={() => { setReplyToMessage(null) }}>
                        <CloseOutlined />
                    </button>
                </Flex>
            )}

            {typingUserId && (userId !== typingUserId) && <div className='typing'>{typingUserName} печатает...</div>}

            {selectedMessages.length === 0
                ? <Flex alignItems='center' className='wrapper'>
                    <Input
                        value={content}
                        onChange={handleChange}
                        onPressEnter={sendMessage}
                        placeholder="Напишите сообщение..."
                    />
                    <div onMouseEnter={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }}>
                        <button className="btn">😊</button>
                        {isHovered && (
                            <div className="emoji-picker">
                                <Picker data={data} onEmojiSelect={(emoji: Emoji) => { setContent(content + emoji.native) }} />
                            </div>
                        )}
                    </div>
                    {isRecording ? (
                        <button className='btn' onClick={stopRecording}>
                            <AudioMutedOutlined className='icon' />
                        </button>
                    ) : (
                        <button className='btn' onClick={startRecording}>
                            <AudioOutlined className='icon' />
                        </button>
                    )}
                    {audioUrl != null && <audio controls src={audioUrl} />}
                    <button className='btn send' onClick={sendMessage}>
                        <SendOutlined />
                    </button>
                </Flex>
                : <Flex direction='column' className='selected-messages'>
                    <Flex justifyContent='space-between' alignItems='center'>
                        <div className="selected-count">{getMessageCountText(selectedMessages.length)}</div>
                        <button className="cancel" onClick={() => {
                            setSelectedMessages([])
                        }}>x
                        </button>
                    </Flex>
                    <Flex alignItems='center'>
                        <AccentButton onClick={handleClickReply} disabled={selectedMessages.length > 1}>
                            Ответить
                        </AccentButton>

                        <AccentButton onClick={() => { console.log('Переслать') }}>
                            Переслать
                        </AccentButton>
                    </Flex>
                </Flex>
            }
        </StyledChatBottom>
    )
}

export default memo(ChatBottom, (prevProps, nextProps) => {
    return (
        prevProps.receiverId === nextProps.receiverId &&
        prevProps.replyToMessage === nextProps.replyToMessage &&
        prevProps.scrollToBottom === nextProps.scrollToBottom &&
        prevProps.selectedMessages.length === nextProps.selectedMessages.length &&
        prevProps.setSelectedMessages === nextProps.setSelectedMessages
    )
})
