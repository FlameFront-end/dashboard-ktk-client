import { api } from '@/core'

export const disciplinesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createDiscipline: builder.mutation<Collections.Discipline, { name: string }>({
            query: (body) => ({
                url: '/disciplines',
                method: 'POST',
                body
            })
        }),
        getAllDisciplines: builder.query<Collections.Discipline[], void>({
            query: () => ({
                url: '/disciplines',
                method: 'GET'
            })
        })
    })
})

export const {
    useCreateDisciplineMutation,
    useGetAllDisciplinesQuery
} = disciplinesApi
