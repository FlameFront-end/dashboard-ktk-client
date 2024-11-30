import { type FC, useEffect } from 'react'
import Chat from '../../components/Chat'
import { useLocation, useNavigate } from 'react-router-dom'
import { useWindowWidth } from '@/hooks'
import { pathsConfig } from '@/pathsConfig'

const ChatPage: FC = () => {
    const { state } = useLocation()
    const windowWidth = useWindowWidth()
    const navigate = useNavigate()

    useEffect(() => {
        if (windowWidth > 800) {
            navigate(pathsConfig.chat_list)
        }
    }, [windowWidth])

    return (
        <Chat chatId={state?.chatId}/>
    )
}

export default ChatPage
