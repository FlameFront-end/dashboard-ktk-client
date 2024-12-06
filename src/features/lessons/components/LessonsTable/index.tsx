import { type FC, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Table, Tabs } from 'antd'
import moment from 'moment/moment'
import { Flex } from '@/kit'
import { pathsConfig } from '@/pathsConfig'
import { useGetGroupQuery } from '../../../groups/api/groups.api.ts'

const { TabPane } = Tabs

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

interface Props {
    groupId: string
}

const LessonsTable: FC<Props> = ({ groupId }) => {
    const navigate = useNavigate()
    const { data: group } = useGetGroupQuery(groupId)

    const schedule = group?.schedule ?? { id: '', friday: [], monday: [], tuesday: [], thursday: [], wednesday: [] }

    const today = moment()
    const currentWeekStartInitial = today.startOf('isoWeek')
    const maxWeekStart = today.startOf('isoWeek')

    const [currentWeekStart, setCurrentWeekStart] = useState(currentWeekStartInitial)

    const generateTableData = (lessons: Collections.Lesson[], disciplineId: string): ReactNode => {
        const uniqueDates = new Set<string>()
        lessons.forEach(lesson => {
            weekdays.forEach((day, index) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
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
                render: () => (
                    <div>
                        <Button onClick={() => { handleCreateLesson(date.format('YYYY-MM-DD'), disciplineId) }}>
                            Создать
                        </Button>
                    </div>
                )
            }))
        ]

        return <Table columns={columns} dataSource={[{ title: 'Задания' }]} pagination={false} />
    }

    const lessonsByDiscipline = Object.values(schedule)
        .flat()
        .filter((entry): entry is Collections.Lesson => Boolean(entry.discipline))
        .reduce((acc: Record<string, Collections.Lesson[]>, lesson) => {
            const disciplineId = lesson.discipline?.id
            if (disciplineId) {
                acc[disciplineId] = acc[disciplineId] || []
                acc[disciplineId].push(lesson)
            }
            return acc
        }, {})

    const nextWeek = (): void => {
        const next = currentWeekStart.clone().add(1, 'week')
        if (!next.isAfter(maxWeekStart)) {
            setCurrentWeekStart(next)
        }
    }

    const previousWeek = (): void => {
        setCurrentWeekStart(currentWeekStart.clone().subtract(1, 'week'))
    }

    const handleCreateLesson = (date: string, disciplineId: string): void => {
        navigate(pathsConfig.create_lesson, { state: { date, groupId, disciplineId } })
    }

    return (
        <>
            <div style={{ marginBottom: '16px' }}>
                <Flex gap={12} alignItems="center">
                    <Button onClick={previousWeek} disabled={currentWeekStart.isBefore('2024-09-01')}>
                      Предыдущая неделя
                    </Button>
                    <Button onClick={nextWeek} disabled={currentWeekStart.isSame(maxWeekStart)}>
                      Следующая неделя
                    </Button>

                    <span style={{ marginLeft: '16px' }}>
                        {currentWeekStart.format('DD.MM.YYYY')} - {currentWeekStart.clone().add(6, 'days').format('DD.MM.YYYY')}
                    </span>
                </Flex>
            </div>

            <Tabs defaultActiveKey="1">
                {Object.entries(lessonsByDiscipline).map(([disciplineId, lessons]) => (
                    <TabPane tab={lessons[0]?.discipline?.name ?? 'Unnamed Discipline'} key={disciplineId}>
                        {generateTableData(lessons, disciplineId)}
                    </TabPane>
                ))}
            </Tabs>
        </>
    )
}
export default LessonsTable
