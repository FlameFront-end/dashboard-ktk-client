import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import type { LoginResponse } from '../types/login.types'

interface AuthState {
    user: {
        isAuth: boolean
        isOnline: boolean
        lastSeen: string | undefined
        token: string | undefined | null
        id: number | undefined
        ava: string | undefined
        name: string | undefined
        surname: string | undefined
        patronymic: string | null | undefined
    }
}

const user = JSON.parse(Cookies.get('user') ?? '{}') as {
    token?: string
    id?: number
    ava?: string
    name?: string
    surname?: string
    patronymic?: string | null
    isOnline?: boolean
    lastSeen?: string
}

const initialState: AuthState = {
    user: {
        isOnline: false,
        lastSeen: user?.lastSeen,
        isAuth: user?.token != null,
        token: user?.token,
        id: user?.id,
        ava: user?.ava,
        name: user?.name,
        surname: user?.surname,
        patronymic: user?.patronymic
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, { payload }: PayloadAction<LoginResponse>) {
            Cookies.set('token', payload.token)
            Cookies.set('user', JSON.stringify(payload))

            state.user = {
                ...payload,
                isAuth: true
            }
        },
        removeUser(state) {
            Cookies.remove('token')
            Cookies.remove('user')

            state.user.token = null
            state.user.id = undefined
            state.user.name = undefined
            state.user.surname = undefined
            state.user.patronymic = undefined
            state.user.isAuth = false
            state.user.ava = undefined
            state.user.isOnline = false
        }
    }
})

export const { reducer: authReducer, actions: authActions } = authSlice
