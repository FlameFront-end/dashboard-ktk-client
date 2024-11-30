import { type FC, useEffect } from 'react'
import { Button, Input, Modal, Form, message } from 'antd'
import {
    type TeacherCreatePayload,
    useCreateTeacherMutation,
    useGetAllTeachersQuery,
    useUpdateTeacherMutation
} from '../../api/teachers.api.ts'

interface Props {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    teacher: Collections.Teacher | null
}

const TeacherModal: FC<Props> = ({ open, onClose, onSuccess, teacher }) => {
    const [form] = Form.useForm()
    const [createTeacher, { isLoading: isLoadingCreate }] = useCreateTeacherMutation()
    const [updateTeacher, { isLoading: isLoadingUpdate }] = useUpdateTeacherMutation()

    const { refetch } = useGetAllTeachersQuery()

    useEffect(() => {
        if (teacher) {
            form.setFieldsValue(teacher)
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
                await createTeacher(values).unwrap()
                void message.success('Преподаватель успешно создан')
            }
            void refetch()
            form.resetFields()
            onSuccess()
            onClose()
        } catch (error) {
            if (teacher) {
                void message.error('Ошибка при редактировании преподавателя')
            } else {
                void message.error('Ошибка при создании преподавателя')
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
                    name="discipline"
                    label="Дисциплина"
                    rules={[{ required: true, message: 'Введите дисциплину' }]}
                >
                    <Input placeholder="Введите дисциплину" />
                </Form.Item>
                <Form.Item
                    name="group"
                    label="Группа"
                >
                    <Input placeholder="Введите группу" />
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
