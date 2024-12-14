import { type FC, useEffect } from 'react'
import { Button, Input, Modal, Form, message, Select } from 'antd'
import {
    type TeacherCreatePayload,
    useCreateTeacherMutation,
    useGetAllTeachersQuery,
    useUpdateTeacherMutation
} from '../../api/teachers.api.ts'
import { useGetAllDisciplinesQuery } from '../../../disciplines/api/disciplines.api.ts'
import { useGetAllGroupsWithoutTeacherQuery } from '../../../groups/api/groups.api.ts'

interface Props {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    teacher: Collections.Teacher | null
}

const TeacherModal: FC<Props> = ({ open, onClose, onSuccess, teacher }) => {
    const [form] = Form.useForm()
    const { data: groups } = useGetAllGroupsWithoutTeacherQuery()
    const { data: disciplines } = useGetAllDisciplinesQuery()

    const [createTeacher, { isLoading: isLoadingCreate }] = useCreateTeacherMutation()
    const [updateTeacher, { isLoading: isLoadingUpdate }] = useUpdateTeacherMutation()

    const { refetch } = useGetAllTeachersQuery()

    useEffect(() => {
        if (teacher) {
            const formattedData = {
                ...teacher,
                group: teacher.group?.id,
                discipline: teacher.discipline?.id
            }

            form.setFieldsValue(formattedData)
        } else {
            form.resetFields()
        }
    }, [teacher])

    const handleSubmit = async (values: TeacherCreatePayload): Promise<void> => {
        try {
            if (teacher) {
                await updateTeacher({ id: teacher.id, ...values }).unwrap()
                void message.success('Преподаватель успешно изменён')
            } else {
                console.log('values', values)
                await createTeacher(values).unwrap()
                void message.success('Данные для входа отправлены преподавателю на почту')
            }
            onSuccess()
            onClose()
            void refetch()
            form.resetFields()
        } catch (error: any) {
            if (teacher) {
                void message.error('Ошибка при редактировании преподавателя')
            } else {
                if (error.data.message === 'User with this email already exists') {
                    void message.error('Эта почта уже занята')
                } else {
                    void message.error('Ошибка при создании преподавателя')
                }
            }
        }
    }

    return (
        <Modal
            title={teacher ? 'Изменить преподавателя' : 'Создать преподавателя'}
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    void handleSubmit(values)
                }}
            >
                <Form.Item
                    name="name"
                    label="ФИО"
                    rules={[{ required: true, message: 'Введите ФИО' }]}
                >
                    <Input placeholder="Введите ФИО" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Введите email' }]}
                >
                    <Input type='email' placeholder="Введите email" />
                </Form.Item>
                <Form.Item
                    name="discipline"
                    label="Дисциплина"
                    rules={[{ required: true, message: 'Введите дисциплину' }]}
                >
                    <Select
                        placeholder="Выберите дисциплину"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={disciplines?.map((lesson) => ({
                            value: lesson.id,
                            label: lesson.name
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    name="group"
                    label="Группа"
                >
                    <Select
                        placeholder="Выберите группу"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={groups?.map((group) => ({
                            value: group.id,
                            label: group.name
                        }))}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoadingCreate || isLoadingUpdate}>
                        {teacher ? 'Изменить' : 'Создать'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default TeacherModal
