import { type FC, useEffect } from 'react'
import { Button, DatePicker, Input, Modal, Form, message } from 'antd'
import {
    type StudentCreatePayload,
    useCreateStudentMutation,
    useGetAllStudentsQuery,
    useUpdateStudentMutation
} from '../../api/students.api.ts'
import dayjs from 'dayjs'

interface Props {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    student: Collections.Student | null
}

const StudentModal: FC<Props> = ({ open, onClose, onSuccess, student }) => {
    const [form] = Form.useForm()
    const [createStudent, { isLoading: isLoadingCreate }] = useCreateStudentMutation()
    const [updateStudent, { isLoading: isLoadingUpdate }] = useUpdateStudentMutation()
    const { refetch } = useGetAllStudentsQuery()

    useEffect(() => {
        if (student) {
            const { birthDate, ...studentWithoutBirthDate } = student

            const formattedStudent = {
                ...studentWithoutBirthDate,
                birthDate: birthDate ? dayjs(birthDate, 'DD.MM.YYYY') : null
            }

            form.setFieldsValue(formattedStudent)
        } else {
            form.resetFields()
        }
    }, [student])

    const handleSubmit = async (values: StudentCreatePayload): Promise<void> => {
        try {
            if (student) {
                await updateStudent({ id: student.id, ...values }).unwrap()
                void message.success('Студент успешно изменён')
            } else {
                await createStudent(values).unwrap()
                void message.success('Студент успешно создан')
            }

            void refetch()
            form.resetFields()
            onSuccess()
            onClose()
        } catch (error) {
            if (student) {
                void message.error('Ошибка при редактировании студента')
            } else {
                void message.error('Ошибка при создании студента')
            }
        }
    }

    return (
        <Modal
            title={student ? 'Изменить студента' : 'Создать студента'}
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
                    name="group"
                    label="Группа"
                    rules={[{ required: true, message: 'Введите группу' }]}
                >
                    <Input placeholder="Введите группу" />
                </Form.Item>
                <Form.Item
                    name="birthDate"
                    label="Дата рождения"
                    rules={[{ required: true, message: 'Выберите дату рождения' }]}
                >
                    <DatePicker
                        format="DD.MM.YYYY"
                        style={{ width: '100%' }}
                        placeholder="Выберите дату"
                    />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Номер телефона"
                >
                    <Input type='phone' placeholder="Введите номер телефона" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                >
                    <Input type='email' placeholder="Введите email" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoadingCreate || isLoadingUpdate}>
                        {student ? 'Изменить' : 'Создать'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default StudentModal
