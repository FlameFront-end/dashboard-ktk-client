import { type FC, type ReactNode, useEffect, useState } from 'react'
import moment from 'moment'
import { Button, message, Table, Typography } from 'antd'
import { pathsConfig } from '@/pathsConfig'
import { useNavigate } from 'react-router-dom'
import { Flex } from '@/kit'
import { EditOutlined } from '@ant-design/icons'
import { useAppSelector } from '@/hooks'
import { BACKEND_URL } from '@/constants'
import ReactMarkdown from 'react-markdown'

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

interface Props {
    lessons: any[]
    disciplineId: string
    groupId: string
    currentWeekStart: moment.Moment
    schedule: any
    teacherId: string | undefined
}

const LessonsTable: FC<Props> = ({ lessons, disciplineId, groupId, currentWeekStart, schedule, teacherId }) => {
    const navigate = useNavigate()

    const role = useAppSelector(state => state.auth.user.role)
    const myId = useAppSelector(state => state.auth.user.id)

    const [lessonsData, setLessonsData] = useState<Collections.Lesson[]>([])

    const fetchLessons = async (): Promise<void> => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/lessons/${groupId}/${disciplineId}`)
            const data = await response.json()
            setLessonsData(data)
        } catch (error) {
            void message.error('Ошибка при загрузке оценок.')
        }
    }

    const findLessonByDate = (date: string): any | null => {
        for (const lesson of lessonsData) {
            if (lesson.date === date) {
                return lesson
            }
        }
        return null
    }

    const generateTableData = (lessons: Collections.Lesson[]): ReactNode => {
        const uniqueDates = new Set<string>()
        lessons.forEach(lesson => {
            weekdays.forEach((day, index) => {
                const lessonsForDay = schedule[day]
                if (Array.isArray(lessonsForDay) && lessonsForDay.some(entry => entry.discipline?.id === lesson.discipline?.id)) {
                    const date = currentWeekStart.clone().add(index, 'days')
                    uniqueDates.add(date.toISOString())
                }
            })
        })

        const lessonDates: moment.Moment[] = [...uniqueDates].map(dateString => moment(dateString))

        const columns = [
            ...Array.from(lessonDates).map(date => ({
                title: date.format('DD.MM'),
                dataIndex: date.format('DD.MM'),
                key: date.format('DD.MM'),
                render: () => {
                    const lesson = findLessonByDate(date.format('YYYY-MM-DD')) as Collections.Lesson
                    return (
                        <div style={{ width: '300px', minHeight: '100%' }}>
                            {lesson ? (
                                <Flex gap={0} alignItems='start' justifyContent='space-between'>
                                    <Flex direction="column">
                                        <Typography.Paragraph style={{ margin: 0 }}>
                                            <b>Название:</b> <br/>
                                            <ReactMarkdown>
                                                {lesson.title}
                                            </ReactMarkdown>
                                        </Typography.Paragraph>
                                        <Typography.Paragraph style={{ margin: 0 }}>
                                            <b>Описание:</b> <br/>
                                            <ReactMarkdown>
                                                {lesson.description}
                                            </ReactMarkdown>
                                        </Typography.Paragraph>
                                        <Typography.Paragraph style={{ margin: 0 }}>
                                            <b>Домашнее задание:</b> <br/>
                                            <ReactMarkdown>
                                                {lesson.homework}
                                            </ReactMarkdown>
                                        </Typography.Paragraph>
                                    </Flex>

                                    {(role === 'admin' || myId === teacherId) && (
                                        <Button onClick={() => { handleEditLesson(date.format('YYYY-MM-DD'), disciplineId, lesson.id) }}>
                                            <EditOutlined/>
                                        </Button>
                                    )}
                                </Flex>
                            ) : (
                                <>
                                    {(role === 'admin' || myId === teacherId) && (
                                        <Button onClick={() => { handleCreateLesson(date.format('YYYY-MM-DD'), disciplineId) }}>
                                          Создать
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    )
                }
            }))
        ]

        return <Table columns={columns} dataSource={[{ title: 'Задания' }]} pagination={false}/>
    }

    const handleCreateLesson = (date: string, disciplineId: string): void => {
        navigate(pathsConfig.create_lesson, { state: { date, groupId, disciplineId } })
    }

    const handleEditLesson = (date: string, disciplineId: string, lessonId: string): void => {
        navigate(pathsConfig.edit_lesson, { state: { date, groupId, disciplineId, lessonId } })
    }

    useEffect(() => {
        void fetchLessons()
    }, [groupId, disciplineId])

    return (
        <div className='table-wrapper'>
            {generateTableData(lessons)}
        </div>
    )
}

export default LessonsTable
