import { type FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Select, Tabs, Button, message, Space, Card } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Flex } from '@/kit'
import { useGetAllTeachersQuery } from '../../../teachers/api/teachers.api'
import { useGetAllStudentsQuery } from '../../../students/api/students.api'
import {
    type UpdateGroupPayload,
    useGetGroupQuery, useUpdateGroupMutation
} from '../../api/groups.api.ts'
import { daysOfWeek } from '@/constants'
import { useGetAllDisciplinesQuery } from '../../../disciplines/api/disciplines.api.ts'
import { pathsConfig } from '@/pathsConfig'

const UpdateGroup: FC = () => {
    const { state } = useLocation()
    const navigate = useNavigate()

    const [form] = Form.useForm()

    const { data: teachers } = useGetAllTeachersQuery()
    const { data: students } = useGetAllStudentsQuery()
    const { data: disciplines } = useGetAllDisciplinesQuery()
    const { data: group, refetch } = useGetGroupQuery(state.id)

    const [updateGroup, { isLoading }] = useUpdateGroupMutation()

    const [schedule, setSchedule] = useState<Record<string, any[]>>({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    })

    useEffect(() => {
        if (group?.schedule) {
            const initialSchedule: Record<string, Array<{ discipline: any, teacher: any, cabinet: string }>> = {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: []
            }

            daysOfWeek.forEach(({ en }) => {
                // @ts-expect-error
                initialSchedule[en] = (group?.schedule[en] || []).map(subject => ({
                    discipline: subject.discipline || null,
                    teacher: subject.teacher || null,
                    cabinet: subject.cabinet || ''
                }))
            })

            setSchedule(initialSchedule)

            form.setFieldsValue({
                name: group.name,
                teacher: group.teacher?.id,
                students: group.students?.map((student) => student.id)
            })
        }
    }, [group, form])

    const handleAddSubject = (day: string): void => {
        setSchedule((prev) => ({
            ...prev,
            [day]: [...prev[day], { title: '', teacher: '', cabinet: '' }]
        }))
    }

    const handleRemoveSubject = (day: string, index: number): void => {
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }))
    }

    const handleScheduleChange = (day: string, index: number, field: string, value: any): void => {
        setSchedule((prev) => {
            const newDaySchedule = prev[day].map((item, i) => {
                if (i === index) {
                    const newObject = field === 'discipline' ? disciplines?.find(d => d.id === value)
                        : field === 'teacher' ? teachers?.find(t => t.id === value)
                            : value
                    return { ...item, [field]: newObject }
                }
                return item
            })
            return { ...prev, [day]: newDaySchedule }
        })
    }

    const handleSubmit = async (values: any): Promise<void> => {
        try {
            const payload: UpdateGroupPayload = {
                ...values,
                id: state.id,
                schedule
            }

            await updateGroup(payload).unwrap().then(() => {
                void message.success('Группа успешно изменена')
                navigate(pathsConfig.group, { state: { id: state.id } })
                void refetch()
            })
        } catch (error) {
            void message.error('Ошибка при изменении группы')
        }
    }

    return (
        <Card title='Редактирование группы'>
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    void handleSubmit(values)
                }}
            >
                <Form.Item
                    name="name"
                    label="Название группы"
                    rules={[{ required: true, message: 'Введите название группы' }]}
                >
                    <Input placeholder="Введите название группы" />
                </Form.Item>

                <Form.Item
                    name="teacher"
                    label="Классный руководитель"
                    rules={[{ required: true, message: 'Выберите классного руководителя' }]}
                >
                    <Select
                        placeholder="Выберите классного руководителя"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={teachers?.map((teacher) => ({
                            value: teacher.id,
                            label: teacher.name
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    name="students"
                    label="Студенты"
                >
                    <Select
                        mode="multiple"
                        placeholder="Выберите студентов"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={students?.map((student) => ({
                            value: student.id,
                            label: student.name
                        }))}
                    />
                </Form.Item>

                <Tabs
                    items={daysOfWeek.map(({ en, ru }) => ({
                        key: en,
                        label: ru,
                        children: (
                            <Flex direction="column" gap={24}>
                                {schedule[en].map((subject, index) => {
                                    return (
                                        <Space key={index} align="baseline">
                                            <Select
                                                placeholder="Выберите предмент"
                                                value={subject.discipline?.id ? subject.discipline.id : null}
                                                onChange={(value) => { handleScheduleChange(en, index, 'discipline', value) }}
                                                showSearch
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={disciplines?.map((discipline) => ({
                                                    value: discipline.id,
                                                    label: discipline.name
                                                }))}
                                                style={{ width: 200 }}
                                            />

                                            <Select
                                                placeholder="Выберите учителя"
                                                value={subject.teacher.id ? subject.teacher.id : null}
                                                onChange={(value) => { handleScheduleChange(en, index, 'teacher', value) }}
                                                showSearch
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={teachers?.map((teacher) => ({
                                                    value: teacher.id,
                                                    label: teacher.name
                                                }))}
                                                style={{ width: 200 }}
                                            />
                                            <Input
                                                placeholder="Кабинет"
                                                value={subject.cabinet}
                                                onChange={(e) => { handleScheduleChange(en, index, 'cabinet', e.target.value) }}
                                            />
                                            <MinusCircleOutlined onClick={() => { handleRemoveSubject(en, index) }} />
                                        </Space>
                                    )
                                })}
                                <Button
                                    type="dashed"
                                    onClick={() => { handleAddSubject(en) }}
                                    icon={<PlusOutlined />}
                                    style={{ width: 'max-content' }}
                                >
                                    Добавить предмет
                                </Button>
                            </Flex>
                        )
                    }))}
                />

                <Form.Item style={{ marginTop: '20px' }}>
                    <Button htmlType="submit" type="primary" loading={isLoading}>
                        Изменить группу
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default UpdateGroup