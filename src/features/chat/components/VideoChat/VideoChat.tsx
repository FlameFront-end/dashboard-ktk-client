import { type FC, useEffect, useRef, useState } from 'react'
import { StyledVideoChatWrapper } from './VideoChat.styled.tsx'
import { BACKEND_URL } from '@/constants'
import { io, type Socket } from 'socket.io-client'

interface Props {
    receiverId: number
    userId: number
}

const VideoChat: FC<Props> = ({ receiverId, userId }) => {
    const [isVideoChatActive, setIsVideoChatActive] = useState(false)
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
    const peerConnection = useRef<RTCPeerConnection | null>(null)
    const socketRef = useRef<Socket | null>(null)

    const stopExistingStreams = (): void => {
        localStream?.getTracks().forEach(track => {
            track.stop()
        })
    }

    const handleRemoteStream = (stream: MediaStream): void => {
        setRemoteStream(stream)
    }

    const startVideoChat = async (): Promise<void> => {
        try {
            stopExistingStreams()

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            setLocalStream(stream)

            peerConnection.current = new RTCPeerConnection()

            stream.getTracks().forEach(track => {
                peerConnection.current?.addTrack(track, stream)
            })

            peerConnection.current.ontrack = (event: any) => {
                if (event?.streams && event.streams[0]) {
                    handleRemoteStream(event.streams[0])
                }
            }

            peerConnection.current.onicecandidate = (event: any) => {
                if (event.candidate) {
                    socketRef.current?.emit('ice-candidate', { candidate: event.candidate, receiverId })
                }
            }

            const offer = await peerConnection.current.createOffer()
            await peerConnection.current.setLocalDescription(offer)
            socketRef.current?.emit('video-offer', { offer, receiverId })

            setIsVideoChatActive(true)
        } catch (error: any) {
            if (error.name === 'NotAllowedError') {
                alert('Access to camera/microphone was denied. Please enable permissions and try again.')
            } else if (error.name === 'NotReadableError') {
                alert('Camera or microphone is already in use by another application.')
            } else {
                console.error('Error starting video chat:', error)
            }
        }
    }

    useEffect(() => {
        socketRef.current = io(BACKEND_URL, {
            query: { userId }
        })

        socketRef.current.on('start-video-chat', () => {
            if (!isVideoChatActive) {
                void startVideoChat()
            }
        })

        socketRef.current.on('video-offer', async (data) => {
            if (!peerConnection.current) await startVideoChat()

            await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.offer))
            const answer = await peerConnection.current?.createAnswer()
            await peerConnection.current?.setLocalDescription(answer)
            socketRef.current?.emit('video-answer', { answer, receiverId })
        })

        socketRef.current.on('video-answer', async (data) => {
            await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.answer))
        })

        socketRef.current.on('ice-candidate', async (data) => {
            await peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.candidate))
        })

        return () => {
            peerConnection.current?.close()
            peerConnection.current = null
            socketRef.current?.disconnect()
            setLocalStream(null)
            setRemoteStream(null)
        }
    }, [receiverId])

    const initiateVideoChat = (): void => {
        socketRef.current?.emit('start-video-chat', { receiverId })
        void startVideoChat()
    }

    return (
        <StyledVideoChatWrapper>
            <button onClick={initiateVideoChat}>Start Video Chat</button>
            {isVideoChatActive && (
                <div>
                    <video
                        width={200}
                        height={200}
                        autoPlay
                        playsInline
                        ref={video => {
                            if (video && remoteStream) {
                                video.srcObject = remoteStream
                            }
                        }}
                    />
                </div>
            )}
        </StyledVideoChatWrapper>
    )
}

export default VideoChat
