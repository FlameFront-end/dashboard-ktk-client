import { api } from '@/core'

export const chatApi = api.injectEndpoints({
    endpoints: builder => ({
        getChatsList: builder.query<Collections.Chat[], null>({
            query: () => ({
                url: '/chat/my-chats'
            })
        }),
        createChat: builder.mutation<Collections.Chat, number>({
            query: (user2Id) => ({
                method: 'POST',
                url: '/chat/create',
                body: {
                    user2Id
                }
            })
        })
    })
})

export const { useGetChatsListQuery, useCreateChatMutation } = chatApi
