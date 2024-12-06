import { api } from '@/core'

interface CreateLessonPayload {
    title: string
    description: string
    homework: string
    disciplineId: string
    date: string
    files?: any
}

export const lessonsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createLessons: builder.mutation<any, CreateLessonPayload>({
            query: (body) => ({
                url: '/lessons',
                method: 'POST',
                body
            })
        })
    })
})

export const {
    useCreateLessonsMutation
} = lessonsApi
