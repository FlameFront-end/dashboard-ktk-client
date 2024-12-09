import { type FC } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import {
    SidebarContainer,
    MenuItemContainer,
    MenuItemLabel,
    LogoutButton,
    LogoutButtonLabel
} from './Sidebar.styled'
import { useAppSelector } from '@/hooks'

const Sidebar: FC = () => {
    const groupId = useAppSelector(state => state.auth.user.groupId)
    const { logout } = useAuth()
    const navigate = useNavigate()
    const collapsed = false
    const role = useAppSelector(state => state.auth.user.role)

    const menuItems = [
        ...(groupId ? [{
            label: 'Моя группа',
            key: 'my_group',
            onClick: () => { navigate(pathsConfig.group, { state: { id: groupId } }) }
        },
        {
            label: 'Успеваемость',
            key: 'my_group_performance',
            onClick: () => { navigate(pathsConfig.performance, { state: { id: groupId } }) }
        },
        {
            label: 'Лекции',
            key: 'my_lessons',
            onClick: () => { navigate(pathsConfig.lessons, { state: { id: groupId } }) }
        }
        ] : []),
        ...(role === 'teacher' || role === 'admin' ? [
            {
                label: 'Все группы',
                key: 'group_list',
                onClick: () => { navigate(pathsConfig.group_list) }
            }
        ] : []),
        {
            label: 'Преподаватели',
            key: 'teachers_list',
            onClick: () => { navigate(pathsConfig.teachers_list) }
        },
        {
            label: 'Студенты',
            key: 'students_list',
            onClick: () => { navigate(pathsConfig.students_list) }
        }
    ]

    return (
        <SidebarContainer collapsed={false}>
            <div className="menu">
                {menuItems.map((item) => (
                    <MenuItemContainer key={item.key} onClick={item.onClick}>
                        <MenuItemLabel collapsed={collapsed}>{item.label}</MenuItemLabel>
                    </MenuItemContainer>
                ))}
            </div>
            <LogoutButton collapsed={collapsed} onClick={logout}>
                <LogoutButtonLabel collapsed={collapsed}>Выход</LogoutButtonLabel>
            </LogoutButton>
        </SidebarContainer>
    )
}

export default Sidebar
