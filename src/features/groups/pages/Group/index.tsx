import { type FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetGroupQuery } from '../../api/groups.api.ts'
import { Button, Card, Table, Typography } from 'antd'
import { getDateFormat } from '@/utils'
import ScheduleTable from '../../../schedule/components/ScheduleTable'
import { Flex } from '@/kit'
import { pathsConfig } from '@/pathsConfig'
import { EditOutlined } from '@ant-design/icons'

interface DataSourceStudents {
    id: string
    name: string
    birthDate: string
    phone: string
    email: string
}

const Group: FC = () => {
    const navigate = useNavigate()
    const { state } = useLocation()

    const { data: group, isLoading } = useGetGroupQuery(state.id)

    const dataSourceStudents: DataSourceStudents[] = group?.students?.map(record => ({
        id: record?.id ?? '-',
        name: record?.name ?? '-',
        group: record?.group?.name ?? '-',
        birthDate: getDateFormat(record?.birthDate) ?? '-',
        phone: record?.phone ?? '-',
        email: record?.email ?? '-'
    })) ?? []

    const columns = [
        {
            title: 'ФИО',
            dataIndex: 'name'
        },
        {
            title: 'Дата рождения',
            dataIndex: 'birthDate'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Телефон',
            dataIndex: 'phone'
        }
    ]

    return (
        <Card>
            <Flex justifyContent='space-between'>
                <div>
                    <Typography.Title level={4} style={{ marginBottom: '10px' }}>Группа: {group?.name}</Typography.Title>
                    <Typography.Title level={5} style={{ marginTop: '10px' }}>Классный руководитель: {group?.teacher?.name ?? '-'}</Typography.Title>
                </div>

                <Flex alignItems='center'>
                    <Button onClick={() => { navigate(pathsConfig.performance, { state: { id: group?.id } }) }}>
                        Успеваемость группы
                    </Button>
                    <Button onClick={() => { navigate(pathsConfig.edit_group, { state: { id: group?.id } }) }}>
                        <EditOutlined />
                    </Button>
                </Flex>
            </Flex>

            <Flex direction='column' gap={24}>
                <div>
                    <Typography.Title level={5} style={{ marginBottom: '10px' }}>Расписание</Typography.Title>
                    {!!group?.schedule && <ScheduleTable schedule={group?.schedule}/>}
                </div>

                <div>
                    <Typography.Title level={5} style={{ marginBottom: '10px' }}>Студенты</Typography.Title>
                    <Table<DataSourceStudents>
                        columns={columns}
                        dataSource={dataSourceStudents}
                        pagination={{ pageSize: 5 }}
                        loading={isLoading}
                        rowKey="id"
                    />
                </div>
            </Flex>
        </Card>
    )
}

export default Group
