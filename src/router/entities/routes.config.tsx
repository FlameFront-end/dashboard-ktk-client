import RouterProtect from '../RouterProtect.tsx'
import NotFound404 from '../../pages/NotFound404'
import Layout from '../../containers/Layout'
import { pathsConfig } from '@/pathsConfig'
import { authRoutes } from '../../features/auth/routes/auth.routes.tsx'
import { groupsRoutes } from '../../features/groups/routes/groups.routes.tsx'
import { studentsRoutes } from '../../features/students/routes/students.routes.tsx'
import { teachersRoutes } from '../../features/teachers/routes/teachers.routes.tsx'

export const routesConfig = [
    {
        element: <RouterProtect />,
        errorElement: <NotFound404 />,
        children: [
            {
                path: pathsConfig.root,
                element: <Layout />,
                children: [
                    ...groupsRoutes,
                    ...studentsRoutes,
                    ...teachersRoutes
                ]
            },
            ...authRoutes
        ]
    }
]
