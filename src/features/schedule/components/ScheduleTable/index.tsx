import { type FC, useEffect, useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { StyledScheduleTableWrapper } from './ScheduleTable.styled.tsx'
import { daysOfWeek } from '@/constants'

interface Props {
    schedule: Collections.Schedule
}

interface TableRow {
    index: number
    time: string
    [key: string]: any
}

const ScheduleTable: FC<Props> = ({ schedule }) => {
    const [currentCell, setCurrentCell] = useState<{ day: string, time: string } | null>(null)
    const [currentDay, setCurrentDay] = useState<string>('')

    const maxLessons = Math.max(
        ...daysOfWeek.map(({ en }) => schedule[en as Collections.DayKey]?.length || 0)
    )

    const timeSlots = Array.from({ length: maxLessons }, (_, index) => {
        const startTime = dayjs('08:00', 'HH:mm').add(index * 100, 'minute')
        const endTime = startTime.add(90, 'minute')
        return `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`
    })

    const tableData: TableRow[] = timeSlots.map((time, index) => {
        const row: TableRow = { index: index + 1, time }
        daysOfWeek.forEach(({ en }) => {
            row[en] = schedule[en as Collections.DayKey]?.[index]
                ? [schedule[en as Collections.DayKey][index]]
                : undefined
        })
        return row
    })

    const columns: ColumnsType<TableRow> = [
        {
            title: '№',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            align: 'center'
        },
        {
            title: 'Время',
            dataIndex: 'time',
            key: 'time',
            fixed: 'left'
        },
        ...daysOfWeek.map(({ en, ru }) => ({
            title: ru,
            dataIndex: en,
            key: en,
            onCell: (record: TableRow) => ({
                className: currentCell?.day === en && currentCell?.time === record.time ? 'highlight-cell' : ''
            }),
            render: (lessons: Collections.Lesson[] | undefined) => (
                lessons?.map((lesson, idx) => (
                    <div key={idx} style={{ marginBottom: '8px' }}>
                        <strong>{lesson.title}</strong>
                        <div>Учитель: {lesson.teacher.name}</div>
                        <div>Кабинет: {lesson.cabinet}</div>
                    </div>
                )) ?? ''
            ),
            className: currentDay === en ? 'current-day-column' : ''
        }))
    ]

    useEffect(() => {
        const checkCurrentClass = (): void => {
            const now = dayjs()
            const day = now.format('dddd').toLowerCase()
            setCurrentDay(day)

            const currentTime = now.format('HH:mm')
            const currentClass = timeSlots.find((time) => {
                const [start, end] = time.split(' - ')
                return (
                    dayjs(currentTime, 'HH:mm').isAfter(dayjs(start, 'HH:mm')) &&
                    dayjs(currentTime, 'HH:mm').isBefore(dayjs(end, 'HH:mm'))
                )
            })

            setCurrentCell(currentClass ? { day, time: currentClass } : null)
        }

        checkCurrentClass()
        const interval = setInterval(checkCurrentClass, 60000)

        return () => {
            clearInterval(interval)
        }
    }, [timeSlots])

    return (
        <StyledScheduleTableWrapper>
            <Table<TableRow>
                columns={columns}
                dataSource={tableData}
                pagination={false}
                bordered
                rowKey="time"
            />
        </StyledScheduleTableWrapper>
    )
}

export default ScheduleTable
