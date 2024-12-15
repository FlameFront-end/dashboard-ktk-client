import { type FC, useEffect } from 'react'
import { Form, Input, Button, message, Card, type UploadFile } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'antd/es/form/Form'
import { pathsConfig } from '@/pathsConfig'
import { useEditLessonMutation, useGetLessonQuery } from '../../api/lessons.api.ts'

interface LessonData {
    title: string
    description: string
    homework: string
    files?: UploadFile[]
}

const EditLesson: FC = () => {
    const [form] = useForm()
    const { state } = useLocation()
    const navigate = useNavigate()

    const date: string = state.date
    const groupId: string = state.groupId
    const disciplineId: string = state.disciplineId
    const lessonId: string = state.lessonId

    const { data: lesson } = useGetLessonQuery(lessonId)
    const [editLesson] = useEditLessonMutation()

    useEffect(() => {
        form.setFieldsValue(lesson)
    }, [lesson])

    const onFinish = (values: LessonData): void => {
        const data = {
            id: lessonId,
            title: values.title,
            description: values.description,
            homework: values.homework,
            disciplineId,
            groupId,
            date,
            files: []
        }

        void editLesson(data).unwrap().then(() => {
            void message.success('Лекция успешно измененена')
            navigate(pathsConfig.group, { state: { id: groupId, tab: '3' } })
        })
    }

    return (
        <Card title='Редактирование лекции'>
            <Button
                type='dashed'
                onClick={() => { navigate(pathsConfig.group, { state: { id: groupId, tab: '3' } }) }}
                style={{ marginBottom: '10px' }}
            >
                Назад
            </Button>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Тема лекции"
                    name="title"
                    rules={[{ required: true, message: 'Введите тему леакции' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Описание"
                    name="description"
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    label="Домашнее задание"
                    name="homework"
                >
                    <Input.TextArea />
                </Form.Item>

                {/* <Form.Item label="Файлы"> */}
                {/*     <Upload */}
                {/*         listType="picture-card" */}
                {/*         fileList={fileList} */}
                {/*         onChange={(file) => { */}
                {/*             handleFileChange(file) */}
                {/*         }} */}
                {/*     > */}
                {/*         <Button> */}
                {/*             <UploadOutlined /> */}
                {/*         </Button> */}
                {/*     </Upload> */}
                {/* </Form.Item> */}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Изменить
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default EditLesson
