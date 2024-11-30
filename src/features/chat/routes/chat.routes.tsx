import { chatPaths } from './chat.paths.ts'
import ChatList from '../pages/ChatList'
import ChatPage from '../pages/ChatPage'

export const chatRoutes = [
    {
        path: chatPaths.chat_list,
        element: <ChatList/>
    },
    {
        path: chatPaths.chat,
        element: <ChatPage/>
    }
]
