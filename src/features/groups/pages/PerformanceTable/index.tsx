import { type FC, type ReactNode, useState } from 'react'
import { Table, Select, Button, Card, Typography } from 'antd'
import moment from 'moment'
import { useLocation } from 'react-router-dom'
import { useGetGroupQuery } from '../../api/groups.api.ts'
import { Flex } from '@/kit'

const grades = ['n', '2', '3', '4', '5']
const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

interface StudentGradeRecord {
    student: string
    studentId: string
    key: string
    [date: string]: string
}

const PerformanceTable: FC = () => {
    const { state } = useLocation()

    const { data: group } = useGetGroupQuery(state.id)

    const schedule = group?.schedule ?? ({} as Collections.Schedule)
    const students = group?.students ?? ([] as Collections.Student[])

    const today = moment()
    const currentWeekStartInitial = today.startOf('isoWeek')
    const maxWeekStart = today.startOf('isoWeek')

    const [currentWeekStart, setCurrentWeekStart] = useState(currentWeekStartInitial)
    const [gradesData, setGradesData] = useState<Record<string, Record<string, string>>>({})

    const generateTableData = (discipline: Collections.Discipline): ReactNode => {
        const lessonDates = weekdays.reduce((acc: moment.Moment[], day: string, index) => {
            const lessonsForDay = schedule[day as keyof Collections.Schedule]
            if (Array.isArray(lessonsForDay) && lessonsForDay.some(entry => entry.discipline?.id === discipline.id)) {
                acc.push(currentWeekStart.clone().day(index + 1))
            }
            return acc
        }, [])

        const columns = [
            { title: 'Студент', dataIndex: 'student', key: 'student' },
            ...lessonDates.map(date => ({
                title: date.format('DD.MM'),
                dataIndex: date.format('DD.MM'),
                key: date.format('DD.MM'),
                render: (grade: string, record: StudentGradeRecord) => (
                    <Select
                        value={grade}
                        onChange={(value) => {
                            setGradesData(prevGrades => ({
                                ...prevGrades,
                                [discipline.id]: {
                                    ...prevGrades?.[discipline.id],
                                    [`${record.studentId}-${date.format('YYYY-MM-DD')}`]: value
                                }
                            }))
                        }}
                    >
                        {grades.map(grade => (
                            <Select.Option key={grade} value={grade}>{grade}</Select.Option>
                        ))}
                    </Select>
                )
            }))
        ]

        const data = students.map(student => {
            const row: any = { student: student.name, studentId: student.id, key: student.id }
            lessonDates.forEach(date => {
                row[date.format('DD.MM')] = gradesData?.[discipline.id]?.[`${student.id}-${date.format('YYYY-MM-DD')}`] || 'n'
            })
            return row
        })

        return <Table columns={columns} dataSource={data} pagination={false}/>
    }

    const lessons = Object.values(schedule)
        .flat()
        .filter((entry): entry is Collections.Lesson => Boolean(entry.discipline))
        .reduce((uniqueDisciplines: Collections.Lesson[], lesson) => {
            if (!uniqueDisciplines.some(d => d.discipline?.id === lesson.discipline?.id)) {
                uniqueDisciplines.push(lesson)
            }
            return uniqueDisciplines
        }, [])

    const nextWeek = (): void => {
        const next = currentWeekStart.clone().add(1, 'week')
        if (!next.isAfter(maxWeekStart)) {
            setCurrentWeekStart(next)
        }
    }

    const previousWeek = (): void => {
        setCurrentWeekStart(currentWeekStart.clone().subtract(1, 'week'))
    }

    const sendToServer = (): void => {
        const dataToSend = {
            groupId: state.id,
            weekStart: currentWeekStart.format('YYYY-MM-DD'),
            grades: gradesData
        }

        console.log('dataToSend', dataToSend)
    }

    return (
        <Card>
            <div style={{ marginBottom: '16px' }}>
                <Flex gap={12} alignItems="center">
                    <Button onClick={previousWeek} disabled={currentWeekStart.isBefore('2024-09-01')}>
                        Предыдущая недели
                    </Button>
                    <Button onClick={nextWeek} disabled={currentWeekStart.isSame(maxWeekStart)}>
                        Следующая неделя
                    </Button>

                    <span style={{ marginLeft: '16px' }}>
                        {currentWeekStart.format('DD.MM.YYYY')} - {currentWeekStart.clone().add(6, 'days').format('DD.MM.YYYY')}
                    </span>
                </Flex>
            </div>

            <Flex direction='column' gap={24} style={{ marginBottom: '16px' }}>
                {lessons.filter(lesson => lesson.discipline).map(lesson => (
                    <div key={lesson.id}>
                        <Typography.Title level={3}>{lesson.discipline?.name}</Typography.Title>
                        {!!lesson.discipline && generateTableData(lesson.discipline)}
                    </div>
                ))}
            </Flex>

            <Button onClick={sendToServer}>Сохранить</Button>
        </Card>
    )
}

export default PerformanceTable
