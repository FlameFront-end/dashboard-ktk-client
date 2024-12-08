import { api } from '@/core'

interface CreateLessonPayload {
    title: string
    description: string
    homework: string
    disciplineId: string
    date: string
    files?: any
}

interface EditLessonPayload {
    id: string
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
        }),
        editLesson: builder.mutation<any, EditLessonPayload>({
            query: ({ id, ...body }) => ({
                url: `/lessons/${id}`,
                method: 'PATCH',
                body
            })
        }),
        getLesson: builder.query<any, string>({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}`
            })
        }),
        getALlLessons: builder.query<any, { groupId: string, disciplineId: string }>({
            query: ({ groupId, disciplineId }) => ({
                url: `/lessons/${groupId}/${disciplineId}`
            })
        })
    })
})

export const {
    useCreateLessonsMutation,
    useEditLessonMutation,
    useGetLessonQuery,
    useGetALlLessonsQuery
} = lessonsApi
