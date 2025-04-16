import { type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, Empty, Tabs, Typography } from 'antd'
import GradesChart from '../../components/GradesChart'
import { useGetAllGradesFromStudentQuery } from '../../api/performance.api.ts'

const IndividualPerformance: FC = () => {
	const { state } = useLocation()
	const { data: gradesData } = useGetAllGradesFromStudentQuery(state.id)

	return (
		<Card>
			<Typography.Title level={2}>Моя успеваемость</Typography.Title>

			{gradesData?.length ? (
				<Tabs
					items={gradesData.map((item, index) => ({
						key: `${index}`,
						label: item.discipline,
						children: <GradesChart key={index} data={item} />
					}))}
				/>
			) : (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={<Typography.Text>Нет оценок</Typography.Text>}
				/>
			)}
		</Card>
	)
}

export default IndividualPerformance
