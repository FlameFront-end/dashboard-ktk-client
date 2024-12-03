import { groupsPaths } from './groups.paths.ts'
import GroupList from '../pages/GroupList'
import Group from '../pages/Group'
import CreateGroup from '../pages/CreateGroup'
import EditGroup from '../pages/EditGroup'
import PerformanceTable from '../pages/PerformanceTable'

export const groupsRoutes = [
    {
        path: groupsPaths.group_list,
        element: <GroupList/>
    },
    {
        path: groupsPaths.group,
        element: <Group/>
    },
    {
        path: groupsPaths.create_group,
        element: <CreateGroup/>
    },
    {
        path: groupsPaths.edit_group,
        element: <EditGroup/>
    },
    {
        path: groupsPaths.performance,
        element: <PerformanceTable/>
    }
]
