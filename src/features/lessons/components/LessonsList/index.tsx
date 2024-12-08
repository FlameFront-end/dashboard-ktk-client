import { type FC, useState } from 'react'
import { Button, Tabs } from 'antd'
import moment from 'moment/moment'
import { Flex } from '@/kit'
import { useGetGroupQuery } from '../../../groups/api/groups.api.ts'
import LessonsTable from '../LessonsTable'

const { TabPane } = Tabs

interface Props {
    groupId: string
}

const LessonsList: FC<Props> = ({ groupId }) => {
    const { data: group } = useGetGroupQuery(groupId)

    const schedule = group?.schedule ?? { id: '', friday: [], monday: [], tuesday: [], thursday: [], wednesday: [] }

    const today = moment()
    const currentWeekStartInitial = today.startOf('isoWeek')
    const maxWeekStart = today.startOf('isoWeek')

    const [currentWeekStart, setCurrentWeekStart] = useState(currentWeekStartInitial)

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
                        <LessonsTable lessons={lessons} disciplineId={disciplineId} groupId={groupId} currentWeekStart={currentWeekStart} schedule={schedule}/>
                    </TabPane>
                ))}
            </Tabs>
        </>
    )
}
export default LessonsList
