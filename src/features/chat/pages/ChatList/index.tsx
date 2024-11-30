import { type FC, useEffect, useState } from 'react'
import ChatListSidebar from '../../components/ChatListSidebar'
import Chat from '../../components/Chat'
import { useGetChatsListQuery } from '../../api/chat.api.ts'
import { ChatListStyledWrapper } from './ChatList.styled.tsx'

const ChatList: FC = () => {
    const [activeChatId, setActiveChatId] = useState(0)
    const { data, isFetching, refetch } = useGetChatsListQuery(null)
    const [chatsList, setChatsList] = useState<Collections.Chat[]>([])

    useEffect(() => {
        void refetch()
    }, [])

    useEffect(() => {
        if (data != null) {
            setChatsList(data)
            setActiveChatId(data[0].id)
        }
    }, [data])

    return (
        <ChatListStyledWrapper gap={0}>
            <ChatListSidebar
                setActiveChatId={setActiveChatId}
                activeChatId={activeChatId}
                chatsList={chatsList}
                setChatsList={setChatsList}
                isFetching={isFetching}
            />

            <div className='chat'>
                <Chat chatId={activeChatId}/>
            </div>
        </ChatListStyledWrapper>
    )
}

export default ChatList
