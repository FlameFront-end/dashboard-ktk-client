import { type FC, useState } from 'react'
import { Form, Input, Button, Upload, message, Card, type UploadFile } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'antd/es/form/Form'
import { pathsConfig } from '@/pathsConfig'
import { useCreateLessonsMutation } from '../../api/lessons.api.ts'

interface LessonData {
    title: string
    description: string
    homework: string
    files?: UploadFile[]
}

const CreateLesson: FC = () => {
    const [form] = useForm()
    const { state } = useLocation()
    const navigate = useNavigate()

    const date: string = state.date
    const groupId: string = state.groupId
    const disciplineId: string = state.disciplineId

    console.log('date', date)

    const [createLesson] = useCreateLessonsMutation()

    const [fileList, setFileList] = useState<UploadFile[]>([])

    const handleFileChange = ({ fileList }: { fileList: UploadFile[] }): void => {
        setFileList(fileList)
    }

    const onFinish = (values: LessonData): void => {
        const data = {
            title: values.title,
            description: values.description,
            homework: values.homework,
            disciplineId,
            date,
            files: fileList
        }

        void createLesson(data).then(() => {
            void message.success('Лекция успешно создана')
        })
    }

    return (
        <Card title='Создание лекции'>
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

                <Form.Item label="Файлы">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={(file) => {
                            handleFileChange(file)
                        }}
                    >
                        <Button>
                            <UploadOutlined />
                        </Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Создать
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default CreateLesson
