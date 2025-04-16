import { type FC, isValidElement, ReactElement } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth.ts'
import { useNavigate, useLocation } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import {
	SidebarContainer,
	MenuItemContainer,
	MenuItemLabel,
	LogoutButton,
	LogoutButtonLabel,
	Separator
} from './Sidebar.styled'
import { useAppSelector } from '@/hooks'
import { useGetChatByGroupIdQuery } from '../../features/chat/api/chat.api.ts'
import { useGetTeacherByIdQuery } from '../../features/teachers/api/teachers.api.ts'

type MenuItem = {
	label: string
	key: string
	path: string
	onClick: () => void
	state?: { id: string }
}

type MenuItemsWithSeparators = (MenuItem | ReactElement)[]

const Sidebar: FC = () => {
	const role = useAppSelector(state => state.auth.user.role)
	const groupId = useAppSelector(state => state.auth.user.groupId)
	const userId = useAppSelector(state => state.auth.user.id)

	const { logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

	const { data: chat } = useGetChatByGroupIdQuery(groupId ?? '', {
		skip: !groupId
	})

	const { data: teacher } = useGetTeacherByIdQuery(userId ?? '', {
		skip: role !== 'teacher'
	})

	const menuItems: MenuItemsWithSeparators = [
		...(role === 'teacher' || role === 'admin'
			? [
					{
						label: 'Все группы',
						key: 'group_list',
						path: pathsConfig.group_list,
						onClick: () => {
							navigate(pathsConfig.group_list)
						}
					}
				]
			: []),

		{
			label: 'Преподаватели',
			key: 'teachers_list',
			path: pathsConfig.teachers_list,
			onClick: () => {
				navigate(pathsConfig.teachers_list)
			}
		},
		{
			label: 'Студенты',
			key: 'students_list',
			path: pathsConfig.students_list,
			onClick: () => {
				navigate(pathsConfig.students_list)
			}
		},

		...(role === 'teacher' || role === 'admin'
			? [
					{
						label: 'Администраторы',
						key: 'admins_list',
						path: pathsConfig.admins_list,
						onClick: () => {
							navigate(pathsConfig.admins_list)
						}
					}
				]
			: []),

		...(role === 'admin'
			? [
					{
						label: 'Дисциплины',
						key: 'disciplines',
						path: pathsConfig.disciplines,
						onClick: () => {
							navigate(pathsConfig.disciplines)
						}
					}
				]
			: []),

		...(groupId
			? [
					<Separator key='separator-1' />,
					{
						label: 'Моя группа',
						key: 'my_group',
						path: pathsConfig.group,
						onClick: () => {
							navigate(pathsConfig.group, {
								state: { id: groupId }
							})
						}
					},
					{
						label: 'Успеваемость группы',
						key: 'my_group_performance',
						path: pathsConfig.group_performance,
						onClick: () => {
							navigate(pathsConfig.group_performance, {
								state: { id: groupId }
							})
						}
					},
					...(role === 'student'
						? [
								{
									label: 'Моя успеваемость',
									key: 'my_individual_performance',
									path: pathsConfig.individual_performance,
									onClick: () => {
										navigate(
											pathsConfig.individual_performance,
											{ state: { id: userId } }
										)
									}
								}
							]
						: []),
					{
						label: 'Лекции',
						key: 'my_lessons',
						path: pathsConfig.lessons,
						onClick: () => {
							navigate(pathsConfig.lessons, {
								state: { id: groupId }
							})
						}
					}
				]
			: []),

		...(chat?.id
			? [
					{
						label: 'Чат группы',
						key: 'chat',
						path: pathsConfig.chat,
						onClick: () => {
							navigate(pathsConfig.chat, {
								state: { id: chat.id }
							})
						},
						state: { id: chat.id }
					}
				]
			: []),

		...(role === 'teacher' && teacher?.teachingGroups
			? teacher.teachingGroups.filter(
					group => group.id !== teacher.group?.id
				).length > 0
				? [
						<Separator key='separator-2' />,

						...teacher.teachingGroups
							.filter(group => group.id !== teacher.group?.id)
							.map(group => ({
								label: `Чат группы ${group.name}`,
								key: `chat-${group.chat.id}`,
								path: pathsConfig.chat,
								onClick: () => {
									navigate(pathsConfig.chat, {
										state: { id: group.chat.id }
									})
								},
								state: { id: group.chat.id }
							}))
					]
				: []
			: [])
	]

	return (
		<SidebarContainer>
			{menuItems.map(item => {
				if (isValidElement(item)) {
					return item
				}

				const itemMenuItem = item as MenuItem

				const isActive = !itemMenuItem.key.includes('chat')
					? location.pathname === itemMenuItem.path
					: location.state?.id === itemMenuItem?.state?.id

				return (
					<MenuItemContainer
						key={item.key}
						onClick={itemMenuItem.onClick}
						className={isActive ? 'active' : ''}
					>
						<MenuItemLabel>{itemMenuItem.label}</MenuItemLabel>
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
