import { type FC, useState, type ReactNode } from 'react'
import { Button, Table, Tabs } from 'antd'
import { useGetGroupQuery } from '../../api/groups.api.ts'
import moment from 'moment/moment'
import { Flex } from '@/kit'

const { TabPane } = Tabs

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

interface Props {
    groupId: string
}

const ClassRegisterTable: FC<Props> = ({ groupId }) => {
    const { data: group } = useGetGroupQuery(groupId)

    const schedule = group?.schedule ?? { id: '', friday: [], monday: [], tuesday: [], thursday: [], wednesday: [] }

    const today = moment()
    const currentWeekStartInitial = today.startOf('isoWeek')
    const maxWeekStart = today.startOf('isoWeek')

    const [currentWeekStart, setCurrentWeekStart] = useState(currentWeekStartInitial)

    const generateTableData = (lessons: Collections.Lesson[]): ReactNode => {
        const allLessonDates = new Set<string>()

        lessons.forEach(lesson => {
            const lessonDates = weekdays.reduce((acc: moment.Moment[], day: string, index) => {
                const lessonsForDay = schedule[day as keyof Collections.Schedule]
                if (Array.isArray(lessonsForDay) && lessonsForDay.some(entry => entry.discipline?.id === lesson.discipline?.id)) {
                    acc.push(currentWeekStart.clone().day(index + 1))
                }
                return acc
            }, [])

            lessonDates.forEach(date => allLessonDates.add(date.format('DD.MM')))
        })

        const columns = [
            ...Array.from(allLessonDates).map(dateString => ({
                title: dateString,
                dataIndex: dateString,
                key: dateString,
                render: () => (
                    <div>
                        {lessons[0].discipline?.name}
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
                        {generateTableData(lessons)}
                    </TabPane>
                ))}
            </Tabs>
        </>
    )
}

export default ClassRegisterTable
