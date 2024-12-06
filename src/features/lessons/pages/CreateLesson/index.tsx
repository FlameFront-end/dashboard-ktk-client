import { type FC, useState } from 'react'
import { Form, Input, Button, Upload, message, Card, type UploadFile } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'antd/es/form/Form'

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

    const date = state.date

    const [fileList, setFileList] = useState<UploadFile[]>([])

    const onFinish = async (values: LessonData): Promise<void> => {
        try {
            const data = {
                title: values.title,
                description: values.description,
                files: fileList,
                date
            }

            console.log('data', data)
        } catch (error) {
            void message.error('Ошибка при создании лекции')
        }
    }

    const handleFileChange = ({ fileList }: { fileList: UploadFile[] }): void => {
        setFileList(fileList)
    }

    return (
        <Card title='Создание лекции'>
            <Button
                type='dashed'
                onClick={() => { navigate(-1) }}
                style={{ marginBottom: '10px' }}
            >
                Назад
            </Button>
            <Form
                form={form}
                layout="vertical"
                onFinish={(data) => {
                    void onFinish(data)
                }}
                autoComplete="off"
            >
                <Form.Item
                    label="Название леакции"
                    name="title"
                    rules={[{ required: true, message: 'Введите название леакции' }]}
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
