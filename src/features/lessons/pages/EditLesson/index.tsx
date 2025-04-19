import { type FC, useEffect, useState } from 'react'
import { Form, Input, Button, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'antd/es/form/Form'
import { pathsConfig } from '@/pathsConfig'
import {
	useEditLessonMutation,
	useGetLessonQuery
} from '../../api/lessons.api.ts'
import { Card } from '@/kit'
import type { RcFile, UploadChangeParam } from 'antd/es/upload'

interface LessonData {
	title: string
	description: string
	homework: string
	files?: RcFile[]
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

	const [fileList, setFileList] = useState<RcFile[]>([])

	useEffect(() => {
		if (lesson) {
			form.setFieldsValue({
				title: lesson.title,
				description: lesson.description,
				homework: lesson.homework
			})
		}
	}, [lesson, form])

	const onFinish = (values: LessonData): void => {
		const formData = new FormData()

		formData.append('id', lessonId)
		formData.append('title', values.title)
		formData.append('description', values.description || '')
		formData.append('homework', values.homework || '')
		formData.append('disciplineId', disciplineId)
		formData.append('groupId', groupId)
		formData.append('date', date)

		fileList.forEach(file => {
			formData.append('files', file)
		})

		void editLesson(formData)
			.unwrap()
			.then(() => {
				void message.success('Лекция успешно изменена')
				navigate(pathsConfig.group, {
					state: { id: groupId, tab: '3' }
				})
			})
			.catch(() => {
				void message.error('Ошибка при изменении лекции')
			})
	}

	const onUploadChange = (info: UploadChangeParam) => {
		const files = info.fileList
			.filter(file => !!file.originFileObj)
			.map(file => file.originFileObj as RcFile)
		setFileList(files)
	}

	return (
		<Card title='Редактирование лекции'>
			<Button
				type='dashed'
				onClick={() => {
					navigate(pathsConfig.group, {
						state: { id: groupId, tab: '3' }
					})
				}}
				style={{ marginBottom: '10px' }}
			>
				Назад
			</Button>
			<Form
				form={form}
				layout='vertical'
				onFinish={onFinish}
				autoComplete='off'
			>
				<Form.Item
					label='Тема лекции'
					name='title'
					rules={[{ required: true, message: 'Введите тему лекции' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item label='Описание' name='description'>
					<Input.TextArea />
				</Form.Item>

				<Form.Item label='Домашнее задание' name='homework'>
					<Input.TextArea />
				</Form.Item>

				<Form.Item label='Файлы'>
					<Upload
						multiple
						beforeUpload={() => false}
						fileList={fileList}
						onChange={onUploadChange}
						maxCount={10}
					>
						<Button icon={<UploadOutlined />}>Выбрать файлы</Button>
					</Upload>
				</Form.Item>

				<Form.Item>
					<Button type='primary' htmlType='submit'>
						Изменить
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}

export default EditLesson
