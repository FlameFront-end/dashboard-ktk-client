import { type FC, type ReactNode, useEffect, useState } from 'react'
import moment from 'moment'
import { Button, message, Tag, Typography } from 'antd'
import { pathsConfig } from '@/pathsConfig'
import { useNavigate } from 'react-router-dom'
import { Flex } from '@/kit'
import { EditOutlined } from '@ant-design/icons'
import { useAppSelector } from '@/hooks'
import { BACKEND_URL } from '@/constants'
import ReactMarkdown from 'react-markdown'
import { StyledLessonTable } from '../LessonsList/LessonList.styled.tsx'

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

interface Props {
	lessons: any[]
	disciplineId: string
	groupId: string
	currentWeekStart: moment.Moment
	schedule: any
	teacherId: string | undefined
}

const LessonsTable: FC<Props> = ({
	lessons,
	disciplineId,
	groupId,
	currentWeekStart,
	schedule,
	teacherId
}) => {
	const navigate = useNavigate()
	const role = useAppSelector(state => state.auth.user.role)
	const myId = useAppSelector(state => state.auth.user.id)

	const [lessonsData, setLessonsData] = useState<Collections.Lesson[]>([])

	const fetchLessons = async (): Promise<void> => {
		try {
			const response = await fetch(
				`${BACKEND_URL}/api/lessons/${groupId}/${disciplineId}`
			)
			const data = await response.json()
			setLessonsData(data)
		} catch (error) {
			void message.error('Ошибка при загрузке лекций.')
		}
	}

	const findLessonByDate = (date: string): Collections.Lesson | null => {
		for (const lesson of lessonsData) {
			if (lesson.date === date) {
				return lesson
			}
		}
		return null
	}

	const handleCreateLesson = (date: string, disciplineId: string): void => {
		navigate(pathsConfig.create_lesson, {
			state: { date, groupId, disciplineId }
		})
	}

	const handleEditLesson = (
		date: string,
		disciplineId: string,
		lessonId: string
	): void => {
		navigate(pathsConfig.edit_lesson, {
			state: { date, groupId, disciplineId, lessonId }
		})
	}

	useEffect(() => {
		void fetchLessons()
	}, [groupId, disciplineId])

	const generateTableData = (lessons: Collections.Lesson[]): ReactNode => {
		const uniqueDates = new Set<string>()
		lessons.forEach(lesson => {
			weekdays.forEach((day, index) => {
				const lessonsForDay = schedule[day]
				if (
					Array.isArray(lessonsForDay) &&
					lessonsForDay.some(
						entry => entry.discipline?.id === lesson.discipline?.id
					)
				) {
					const date = currentWeekStart
						.clone()
						.add(index, 'days')
						.toISOString()
					uniqueDates.add(date)
				}
			})
		})
		const lessonDates: moment.Moment[] = [...uniqueDates].map(dateString =>
			moment(dateString)
		)

		const columns = lessonDates.map(date => ({
			title: date.format('DD.MM'),
			dataIndex: date.format('DD.MM'),
			key: date.format('DD.MM'),
			render: () => {
				const lesson = findLessonByDate(date.format('YYYY-MM-DD'))

				if (!lesson) {
					return (
						<>
							{(role === 'admin' || myId === teacherId) && (
								<Button
									onClick={() => {
										handleCreateLesson(
											date.format('YYYY-MM-DD'),
											disciplineId
										)
									}}
								>
									Создать
								</Button>
							)}
						</>
					)
				}

				return (
					<div style={{ width: '300px', minHeight: '100%' }}>
						<Flex
							direction='column'
							style={{ marginBottom: '15px' }}
						>
							<Typography.Paragraph style={{ margin: 0 }}>
								<b>Название:</b> {lesson.title}
							</Typography.Paragraph>
							<Typography.Paragraph style={{ margin: 0 }}>
								<b>Описание:</b>
								<ReactMarkdown>
									{lesson.description || ''}
								</ReactMarkdown>
							</Typography.Paragraph>
							<Typography.Paragraph style={{ margin: 0 }}>
								<b>Домашнее задание:</b>
								<ReactMarkdown>
									{lesson.homework || ''}
								</ReactMarkdown>
							</Typography.Paragraph>

							{lesson.files && lesson.files.length > 0 && (
								<Flex direction='column'>
									<Typography.Text strong>
										Файлы:
									</Typography.Text>
									<Flex direction='column'>
										{lesson.files.map((file, index) => {
											return (
												<Tag
													key={index}
													style={{
														padding: '5px 10px',
														width: 'max-content'
													}}
												>
													<a
														href={file.url}
														target='_blank'
														rel='noopener noreferrer'
													>
														{file.originalName}
													</a>
												</Tag>
											)
										})}
									</Flex>
								</Flex>
							)}
						</Flex>

						{(role === 'admin' || myId === teacherId) && (
							<Button
								icon={<EditOutlined />}
								onClick={() =>
									handleEditLesson(
										date.format('YYYY-MM-DD'),
										disciplineId,
										lesson.id
									)
								}
							>
								Редактировать
							</Button>
						)}
					</div>
				)
			}
		}))

		return (
			<StyledLessonTable
				columns={columns}
				dataSource={[{ key: 'lessons' }]}
				pagination={false}
			/>
		)
	}

	return <>{generateTableData(lessons)}</>
}

export default LessonsTable
