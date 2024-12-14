import { type FC, useEffect, useState } from 'react'
import { Button, Collapse, message, Typography } from 'antd'
import ScheduleTable from '../../../schedule/components/ScheduleTable'
import { Link, useNavigate } from 'react-router-dom'
import { pathsConfig } from '@/pathsConfig'
import { StyledGroupListWrapper } from './GroupList.styled.tsx'
import { useDeleteGroupMutation, useGetAllGroupsQuery } from '../../api/groups.api.ts'
import ConfirmDelete from '../../../kit/components/ConfirmDelete'
import { Flex } from '@/kit'
import { useAppSelector } from '@/hooks'

const GroupList: FC = () => {
    const navigate = useNavigate()
    const role = useAppSelector(state => state.auth.user.role)

    const { data: groups, refetch } = useGetAllGroupsQuery(true)
    const [deleteGroup] = useDeleteGroupMutation()

    const [activeKeys, setActiveKeys] = useState<string[]>([])

    useEffect(() => {
        void refetch()
    }, [])

    useEffect(() => {
        if (groups?.[0]?.id) {
            setActiveKeys([groups[0].id])
        }
    }, [groups])

    const groupByCourse = (groups: Collections.Group[]): Collections.GroupedCourses => {
        const courseMap: Record<string, Collections.Group[]> = {}

        groups.forEach((group) => {
            const course = group.name[0]
            if (!courseMap[course]) {
                courseMap[course] = []
            }
            courseMap[course].push(group)
        })

        return Object.entries(courseMap).sort(
            ([courseA], [courseB]) => Number(courseA) - Number(courseB)
        )
    }

    const groupedCourses: Collections.GroupedCourses = groupByCourse(groups ?? [])

    const handleCollapseChange = (keys: string | string[]): void => {
        setActiveKeys(typeof keys === 'string' ? [keys] : keys)
    }

    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deleteGroup(id).unwrap()
            void message.success('Группа удалена')
            void refetch()
        } catch (error) {
            void message.error('Ошибка при удалении группы')
        }
    }

    return (
        <StyledGroupListWrapper>
            <div className="top-row">
                <Typography.Title level={2}>Все группы</Typography.Title>
                {role === 'admin' && (
                    <Button onClick={() => { navigate(pathsConfig.create_group) }}>Создать группу</Button>
                )}
            </div>
            <div className='group-list'>
                {groupedCourses.map(([course, courseGroups]) => (
                    <div key={course}>
                        <h3 className='course-title'>{course} Курс</h3>
                        <Collapse
                            className='styled-collapse'
                            accordion
                            activeKey={activeKeys}
                            onChange={handleCollapseChange}
                        >
                            {courseGroups.map((group) => (
                                <Collapse.Panel header={group.name} key={group.id}>
                                    <div className='collapse-top'>
                                        <div className='left'>
                                            <div>Классный руководитель: {group.teacher?.name ?? '-'}</div>
                                            {group.schedule && <div>Расписание</div>}
                                        </div>
                                        <Flex alignItems='center'>
                                            <Link to={pathsConfig.group} state={{ id: group.id }}>
                                                Страница группы
                                            </Link>
                                            {role === 'admin' && (
                                                <ConfirmDelete
                                                    handleDelete={async () => { await handleDelete(group.id) }}
                                                    title='Вы уверены, что хотите удалить эту группу?'
                                                />
                                            )}
                                        </Flex>
                                    </div>

                                    {group.schedule && <ScheduleTable schedule={group.schedule}/>}

                                </Collapse.Panel>
                            ))}
                        </Collapse>
                    </div>
                ))}
            </div>
        </StyledGroupListWrapper>
    )
}

export default GroupList
