import { type FC, type ReactNode, useEffect, useState } from 'react'
import { Table, Select, Button, message, Tabs } from 'antd'
import moment from 'moment'
import { Flex } from '@/kit'
import { useGetGroupQuery } from '../../api/groups.api.ts'
import { useCreateGradeMutation } from '../../api/grades.api.ts'

const grades = ['-', 'n', '2', '3', '4', '5']
const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const defaultSchedule = { id: '', friday: [], monday: [], tuesday: [], thursday: [], wednesday: [] }

interface StudentGradeRecord {
    student: string
    studentId: string
    key: string
    [date: string]: string
}

interface Props {
    groupId: string
}

const PerformanceTable: FC<Props> = ({ groupId }) => {
    const { data: group } = useGetGroupQuery(groupId)
    const [createGrade] = useCreateGradeMutation()

    const schedule = group?.schedule ?? defaultSchedule
    const students = group?.students ?? []

    const today = moment()
    const currentWeekStartInitial = today.startOf('isoWeek')
    const maxWeekStart = today.startOf('isoWeek')

    const [currentWeekStart, setCurrentWeekStart] = useState(currentWeekStartInitial)
    const [gradesData, setGradesData] = useState<Record<string, Record<string, Record<string, string>>>>({})

    const lessons = Object.values(schedule)
        .flat()
        .filter((entry): entry is Collections.Lesson => Boolean(entry.discipline))
        .reduce((uniqueDisciplines: Collections.Lesson[], lesson) => {
            if (!uniqueDisciplines.some(d => d.discipline?.id === lesson.discipline?.id)) {
                uniqueDisciplines.push(lesson)
            }
            return uniqueDisciplines
        }, [])

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
                        onChange={(value) => { handleGradeChange(value, discipline.id, date.format('YYYY-MM-DD'), record.studentId) }}
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
                row[date.format('DD.MM')] = gradesData?.[discipline.id]?.[date.format('YYYY-MM-DD')]?.[student.id] || '-'
            })
            return row
        })

        return <Table columns={columns} dataSource={data} pagination={false} />
    }

    const nextWeek = (): void => {
        const next = currentWeekStart.clone().add(1, 'week')
        if (!next.isAfter(maxWeekStart)) {
            setCurrentWeekStart(next)
        }
    }

    const previousWeek = (): void => {
        setCurrentWeekStart(currentWeekStart.clone().subtract(1, 'week'))
    }

    const fetchGrades = async (): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3000/api/groups/${groupId}/grades?weekStart=${currentWeekStart.format('YYYY-MM-DD')}`)
            const data = await response.json()
            setGradesData(data)
        } catch (error) {
            void message.error('Ошибка при загрузке оценок.')
        }
    }

    useEffect(() => {
        void fetchGrades()
    }, [currentWeekStart, groupId])

    const sendToServer = async (): Promise<void> => {
        const dto = {
            groupId,
            weekStart: currentWeekStart.format('YYYY-MM-DD'),
            grades: gradesData
        }

        createGrade(dto)
            .unwrap()
            .then(() => message.success('Оценки успешно сохранены.'))
            .catch(() => message.error('Ошибка при сохранении оценок.'))
    }

    const handleGradeChange = (value: string, disciplineId: string, date: string, studentId: string): void => {
        setGradesData(prevGrades => ({
            ...prevGrades,
            [disciplineId]: {
                ...(prevGrades?.[disciplineId] || {}),
                [date]: {
                    ...(prevGrades?.[disciplineId]?.[date] || {}),
                    [studentId]: value
                }
            }
        }))
    }

    return (
        <Flex direction='column' gap={16}>

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

            {!!schedule.id && (
                <Tabs
                    items={lessons
                        .filter(lesson => lesson.discipline)
                        .map(lesson => ({
                            key: lesson.discipline?.id ?? '',
                            label: lesson.discipline?.name ?? 'Unnamed Discipline',
                            children: lesson.discipline ? generateTableData(lesson.discipline) : <></>
                        }))}
                />
            )}

            <Button onClick={() => { void sendToServer() }} style={{ width: 'max-content' }}>Сохранить</Button>
        </Flex>
    )
}

export default PerformanceTable