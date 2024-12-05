import { type FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeleteGroupMutation, useGetGroupQuery } from '../../api/groups.api.ts'
import { Button, Card, message, Table, Tabs, type TabsProps, Typography } from 'antd'
import { getDateFormat } from '@/utils'
import ScheduleTable from '../../../schedule/components/ScheduleTable'
import { Flex } from '@/kit'
import { pathsConfig } from '@/pathsConfig'
import { EditOutlined } from '@ant-design/icons'
import PerformanceTable from '../../components/PerformanceTable'
import ConfirmDelete from '../../../kit/components/ConfirmDelete'
import ClassRegisterTable from '../../components/ClassRegisterTable'

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

    const groupId = state.id

    const [deleteGroup] = useDeleteGroupMutation()
    const { data: group, isLoading } = useGetGroupQuery(groupId)

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

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Расписание',
            children: (
                <>
                    <Typography.Title level={5} style={{ marginBottom: '10px' }}>Расписание</Typography.Title>
                    {!!group?.schedule && <ScheduleTable schedule={group?.schedule}/>}
                </>
            )
        },
        {
            key: '2',
            label: 'Успеваемость',
            children: <PerformanceTable groupId={groupId}/>
        },
        {
            key: '3',
            label: 'Классный журнал',
            children: <ClassRegisterTable groupId={groupId}/>
        },
        {
            key: '4',
            label: 'Студенты',
            children: (
                <>
                    <Typography.Title level={5} style={{ marginBottom: '10px' }}>Студенты</Typography.Title>
                    <Table<DataSourceStudents>
                        columns={columns}
                        dataSource={dataSourceStudents}
                        pagination={{ pageSize: 5 }}
                        loading={isLoading}
                        rowKey="id"
                    />
                </>
            )
        }
    ]

    const handleDelete = async (): Promise<void> => {
        try {
            await deleteGroup(groupId).unwrap()
            void message.success('Группа удалена')
            navigate(pathsConfig.group_list)
        } catch (error) {
            void message.error('Ошибка при удалении группы')
        }
    }

    return (
        <Card>
            <Flex justifyContent='space-between'>
                <div>
                    <Typography.Title level={4} style={{ marginBottom: '10px' }}>Группа: {group?.name}</Typography.Title>
                    <Typography.Title level={5} style={{ marginTop: '10px' }}>Классный руководитель: {group?.teacher?.name ?? '-'}</Typography.Title>
                </div>

                <Flex alignItems='center'>
                    <Button onClick={() => { navigate(pathsConfig.edit_group, { state: { id: group?.id } }) }}>
                        <EditOutlined />
                    </Button>
                    <ConfirmDelete
                        handleDelete={handleDelete}
                        title='Вы уверены, что хотите удалить эту группу?'
                    />
                </Flex>
            </Flex>

            <Tabs defaultActiveKey="1" items={tabs} />
        </Card>
    )
}

export default Group
