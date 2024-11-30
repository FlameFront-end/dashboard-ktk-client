import { api } from '@/core'

export interface TeacherCreatePayload {
    name: string
    discipline: string
    group?: string
}

export interface TeacherUpdatePayload {
    id: string
    name: string
    discipline: string
    group?: string
}

export const teachersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createTeacher: builder.mutation<Collections.Teacher, TeacherCreatePayload>({
            query: (teacher) => ({
                url: '/teachers',
                method: 'POST',
                body: teacher
            })
        }),
        getAllTeachers: builder.query<Collections.Teacher[], void>({
            query: () => ({
                url: '/teachers',
                method: 'GET'
            })
        }),
        getTeacherById: builder.query<Collections.Teacher, string>({
            query: (id) => ({
                url: `/teachers/${id}`,
                method: 'GET'
            })
        }),
        deleteTeacherById: builder.mutation<void, string>({
            query: (id) => ({
                url: `/teachers/${id}`,
                method: 'DELETE'
            })
        }),
        updateTeacher: builder.mutation<Collections.Teacher, TeacherUpdatePayload>({
            query: ({ id, ...data }) => ({
                url: `/teachers/${id}`,
                method: 'PATCH',
                body: data
            })
        })
    })
})

export const {
    useCreateTeacherMutation,
    useGetAllTeachersQuery,
    useGetTeacherByIdQuery,
    useUpdateTeacherMutation,
    useDeleteTeacherByIdMutation
} = teachersApi
