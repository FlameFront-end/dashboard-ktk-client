import { api } from '@/core'

interface CreateGradePayload {
    grades: any
    groupId: string
    weekStart: string
}

export const performanceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllGroups: builder.query<any, void>({
            query: () => '/groups'
        }),
        createGrade: builder.mutation<any, CreateGradePayload>({
            query: (body) => ({
                url: '/groups/grades',
                method: 'POST',
                body
            })
        })

    })
})

export const {
    useCreateGradeMutation
} = performanceApi
