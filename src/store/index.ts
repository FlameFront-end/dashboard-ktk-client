import { api } from '@/core'
import { authActions, authReducer } from '../features/auth/store/auth.slice'

export const reducers = {
    [api.reducerPath]: api.reducer,
    auth: authReducer
}

export const actions = {
    ...authActions
}
