import { type FC } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth.ts'
import { useNavigate, useLocation } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import {
    SidebarContainer,
    MenuItemContainer,
    MenuItemLabel,
    LogoutButton,
    LogoutButtonLabel
} from './Sidebar.styled'
import { useAppSelector } from '@/hooks'
import { useGetChatByGroupIdQuery } from '../../features/chat/api/chat.api.ts'

const Sidebar: FC = () => {
    const groupId = useAppSelector(state => state.auth.user.groupId)
    const { logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const role = useAppSelector(state => state.auth.user.role)

    const { data: chat } = useGetChatByGroupIdQuery(groupId ?? '', {
        skip: !groupId
    })

    const menuItems = [
        ...(groupId ? [{
            label: 'Моя группа',
            key: 'my_group',
            path: pathsConfig.group,
            onClick: () => { navigate(pathsConfig.group, { state: { id: groupId } }) }
        },
        {
            label: 'Успеваемость',
            key: 'my_group_performance',
            path: pathsConfig.performance,
            onClick: () => { navigate(pathsConfig.performance, { state: { id: groupId } }) }
        },
        {
            label: 'Лекции',
            key: 'my_lessons',
            path: pathsConfig.lessons,
            onClick: () => { navigate(pathsConfig.lessons, { state: { id: groupId } }) }
        }
        ] : []),

        ...(chat?.id ? [
            {
                label: 'Чат группы',
                key: 'chat',
                path: pathsConfig.chat,
                onClick: () => { navigate(pathsConfig.chat, { state: { id: chat.id } }) }
            }
        ] : []),

        ...(role === 'teacher' || role === 'admin' ? [
            {
                label: 'Все группы',
                key: 'group_list',
                path: pathsConfig.group_list,
                onClick: () => { navigate(pathsConfig.group_list) }
            }
        ] : []),

        {
            label: 'Преподаватели',
            key: 'teachers_list',
            path: pathsConfig.teachers_list,
            onClick: () => { navigate(pathsConfig.teachers_list) }
        },
        {
            label: 'Студенты',
            key: 'students_list',
            path: pathsConfig.students_list,
            onClick: () => { navigate(pathsConfig.students_list) }
        },

        ...(role === 'teacher' || role === 'admin' ? [
            {
                label: 'Администаторы',
                key: 'admins_list',
                path: pathsConfig.admins_list,
                onClick: () => { navigate(pathsConfig.admins_list) }
            }
        ] : []),

        ...(role === 'admin' ? [
            {
                label: 'Дисциплины',
                key: 'disciplines',
                path: pathsConfig.disciplines,
                onClick: () => { navigate(pathsConfig.disciplines) }
            }
        ] : [])
    ]

    return (
        <SidebarContainer>
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                    <MenuItemContainer key={item.key} onClick={item.onClick} className={isActive ? 'active' : ''}>
                        <MenuItemLabel>{item.label}</MenuItemLabel>
                    </MenuItemContainer>
                )
            })}
            <LogoutButton onClick={logout}>
                <LogoutButtonLabel>Выход</LogoutButtonLabel>
            </LogoutButton>
        </SidebarContainer>
    )
}

export default Sidebar
