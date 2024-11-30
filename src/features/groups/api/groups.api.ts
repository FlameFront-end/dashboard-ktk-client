import { api } from '@/core'

export interface CreateGroupPayload {
    name: string
    teacher: string
    students: string[]
    schedule: Omit<Collections.Schedule, 'id'>
}

export const groupsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllGroups: builder.query<Collections.Group[], | void>({
            query: () => '/groups'
        }),
        getGroup: builder.query<Collections.Group, | string>({
            query: (id) => `/groups/${id}`
        }),
        createGroup: builder.mutation<Collections.Group, | CreateGroupPayload>({
            query: (body) => ({
                url: '/groups',
                method: 'POST',
                body
            })
        }),
        deleteGroup: builder.mutation<void, | string>({
            query: (id) => ({
                url: `/groups/${id}`,
                method: 'DELETE'
            })
        })
    })
})

export const {
    useGetAllGroupsQuery,
    useGetGroupQuery,
    useCreateGroupMutation,
    useDeleteGroupMutation
} = groupsApi
