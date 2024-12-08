import { type FC, type ReactNode, useEffect, useState } from 'react'
import moment from 'moment'
import { Button, message, Table } from 'antd'
import { pathsConfig } from '@/pathsConfig'
import { useNavigate } from 'react-router-dom'
import { Flex } from '@/kit'
import { EditOutlined } from '@ant-design/icons'

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

interface Props {
    lessons: any[]
    disciplineId: string
    groupId: string
    currentWeekStart: moment.Moment
    schedule: any
}

const LessonsTable: FC<Props> = ({ lessons, disciplineId, groupId, currentWeekStart, schedule }) => {
    const navigate = useNavigate()
    const [lessonsData, setLessonsData] = useState<any[]>([])

    const fetchLessons = async (): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3000/api/lessons/${groupId}/${disciplineId}`)
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

    const truncateText = (text: string, maxLength: number = 50): string => {
        if (text.length <= maxLength) {
            return text
        }
        return text.substring(0, maxLength - 3) + '...'
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
                    const lesson = findLessonByDate(date.format('YYYY-MM-DD'))
                    return (
                        <div>
                            {lesson ? (
                                <Flex gap={4} alignItems='center' justifyContent='space-between'>
                                    <div style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>{truncateText(lesson.title)}</div>
                                    <Button onClick={() => { handleEditLesson(date.format('YYYY-MM-DD'), disciplineId, lesson.id) }}>
                                        <EditOutlined/>
                                    </Button>
                                </Flex>
                            ) : (
                                <Button onClick={() => { handleCreateLesson(date.format('YYYY-MM-DD'), disciplineId) }}>
                                    Создать
                                </Button>
                            )}
                        </div>
                    )
                }
            }))
        ]

        return <Table columns={columns} dataSource={[{ title: 'Задания' }]} pagination={false} scroll={{ x: true }}/>
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
        <>
            {generateTableData(lessons)}
        </>
    )
}

export default LessonsTable
