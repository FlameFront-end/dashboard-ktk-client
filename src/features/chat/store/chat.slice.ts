import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { BACKEND_URL } from '@/constants'

interface ChatState {
    messages: Collections.Message[]
    interlocutor: Collections.User | null
}

const initialState: ChatState = {
    messages: [],
    interlocutor: null
}

export const fetchChatInfo = createAsyncThunk(
    'chat/fetchChatInfo',
    async ({ chatId, userId }: { chatId: number, userId: number }) => {
        const response = await axios.get(`${BACKEND_URL}/chat/${chatId}/info/${userId}`)
        return response.data
    }
)

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatInfo.fulfilled, (state, action) => {
                state.messages = action.payload.messages
                state.interlocutor = action.payload.interlocutor
            })
    }
})

export const { reducer: chatReducer, actions: chatActions } = chatSlice
