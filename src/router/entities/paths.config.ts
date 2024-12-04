import { authPaths } from '../../features/auth/routes/auth.paths.ts'
import { groupsPaths } from '../../features/groups/routes/groups.paths.ts'
import { studentsPaths } from '../../features/students/routes/students.paths.ts'
import { teachersPaths } from '../../features/teachers/routes/teachers.paths.ts'
import { classRegisterPaths } from '../../features/сlass-register/routes/teachers.paths.ts'

export const pathsConfig = {
    root: '/',
    ...authPaths,
    ...groupsPaths,
    ...studentsPaths,
    ...teachersPaths,
    ...classRegisterPaths
}
