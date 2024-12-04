import { type FC } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import { HomeOutlined } from '@ant-design/icons'
import {
    SidebarContainer,
    MenuItemContainer,
    MenuItemIcon,
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

    const menuItems = [
        ...(groupId ? [{
            label: 'Моя группа',
            key: 'my_group',
            icon: <HomeOutlined />,
            onClick: () => { navigate(pathsConfig.group, { state: { id: groupId } }) }
        },
        {
            label: 'Успеваемость',
            key: 'my_group_performance',
            icon: <HomeOutlined />,
            onClick: () => { navigate(pathsConfig.performance, { state: { id: groupId } }) }
        },
        {
            label: 'Классный журнал',
            key: 'my_class_register',
            icon: <HomeOutlined />,
            onClick: () => { navigate(pathsConfig.class_register, { state: { id: groupId } }) }
        }
        ] : []),
        {
            label: 'Все группы',
            key: 'group_list',
            icon: <HomeOutlined />,
            onClick: () => { navigate(pathsConfig.group_list) }
        },
        {
            label: 'Преподаватели',
            key: 'teachers_list',
            icon: <HomeOutlined />,
            onClick: () => { navigate(pathsConfig.teachers_list) }
        },
        {
            label: 'Студенты',
            key: 'students_list',
            icon: <HomeOutlined />,
            onClick: () => { navigate(pathsConfig.students_list) }
        }
    ]

    return (
        <SidebarContainer collapsed={false}>
            <div className="menu">
                {menuItems.map((item) => (
                    <MenuItemContainer key={item.key} onClick={item.onClick}>
                        <MenuItemIcon>{item.icon}</MenuItemIcon>
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
