import { type FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Select, Tabs, Button, message, Space, Card } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Flex } from '@/kit'
import { useGetAllStudentsWithoutTeacherQuery } from '../../../students/api/students.api'
import { type CreateGroupPayload, useCreateGroupMutation, useGetAllGroupsQuery } from '../../api/groups.api.ts'
import { daysOfWeek } from '@/constants'
import { pathsConfig } from '@/pathsConfig'
import { useGetAllDisciplinesQuery } from '../../../disciplines/api/disciplines.api.ts'
import { useGetAllTeachersQuery, useGetAllTeachersWithoutGroupQuery } from '../../../teachers/api/teachers.api.ts'

const CreateGroup: FC = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const { refetch } = useGetAllGroupsQuery(true)
    const { data: teachers, refetch: refetchTeachers } = useGetAllTeachersQuery()
    const { data: classroomTeachers, refetch: refetchClassroomTeachers } = useGetAllTeachersWithoutGroupQuery()
    const { data: students, refetch: refetchStudents } = useGetAllStudentsWithoutTeacherQuery()
    const { data: disciplines, refetch: refetchDisciplines } = useGetAllDisciplinesQuery()

    const [createGroup, { isLoading }] = useCreateGroupMutation()

    const [schedule, setSchedule] = useState<Record<string, any[]>>({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    })

    const handleAddSubject = (day: string): void => {
        setSchedule((prev) => ({
            ...prev,
            [day]: [...prev[day], { discipline: '', teacher: '', cabinet: '' }]
        }))
    }

    const handleRemoveSubject = (day: string, index: number): void => {
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }))
    }

    const handleScheduleChange = (day: string, index: number, field: string, value: any): void => {
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day].map((item, i) => (i === index ? { ...item, [field]: value } : item))
        }))
    }

    const handleSubmit = async (values: any): Promise<void> => {
        try {
            const payload: CreateGroupPayload = {
                ...values,
                schedule
            }
            await createGroup(payload).unwrap().then(() => {
                void message.success('Группа успешно создана')
                form.resetFields()
                void refetch()
                navigate(pathsConfig.group_list)
                setSchedule({
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: []
                })
            })
        } catch (error) {
            void message.error('Ошибка при создании группы')
        }
    }

    useEffect(() => {
        void refetchTeachers()
        void refetchClassroomTeachers()
        void refetchDisciplines()
        void refetchStudents()
    }, [])

    return (
        <Card title='Создание группы'>
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
                        options={classroomTeachers?.map((teacher) => ({
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
                                {schedule[en].map((subject, index) => (
                                    <Space key={index} align="baseline">
                                        <Select
                                            placeholder="Выберите предмент"
                                            value={subject.discipline?.length ? subject.discipline : null}
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
                                            value={subject.teacher.length ? subject.teacher : null}
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
                                ))}
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
                        Создать группу
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default CreateGroup
