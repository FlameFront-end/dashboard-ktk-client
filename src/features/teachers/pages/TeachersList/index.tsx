import { type FC, useState } from 'react'
import { Table, Input, Space, Button, message } from 'antd'
import { useDeleteTeacherByIdMutation, useGetAllTeachersQuery } from '../../api/teachers.api.ts'
import ConfirmDelete from '../../../kit/components/ConfirmDelete'
import { StyledTeachersListWrapper } from './TeachersList.styled.tsx'
import TeacherModal from '../../components/TeacherModal'
import { EditOutlined } from '@ant-design/icons'

const TeachersList: FC = () => {
    const { data: teachers, isLoading, refetch } = useGetAllTeachersQuery()
    const [deleteTeacher] = useDeleteTeacherByIdMutation()

    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState<Collections.Teacher[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingTeacher, setEditingTeacher] = useState<Collections.Teacher | null>(null)

    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deleteTeacher(id).unwrap()
            void message.success('Преподаватель удалён')
            void refetch()
        } catch (error) {
            void message.error('Ошибка при удалении преподавателя')
        }
    }

    const handleModalClose = (): void => {
        setIsModalVisible(false)
        setEditingTeacher(null)
    }

    const handleModalSuccess = (): void => {
        setIsModalVisible(false)
        setIsModalVisible(false)
    }

    const handleSearch = (value: string): void => {
        setSearchText(value)
        const lowercasedValue = value.toLowerCase()

        const filtered = teachers?.filter((teacher: Collections.Teacher) =>
            teacher.name.toLowerCase().includes(lowercasedValue) ||
            teacher.group?.toLowerCase().includes(lowercasedValue)
        )

        setFilteredData(filtered ?? [])
    }

    const handleEdit = (teacher: Collections.Teacher): void => {
        setEditingTeacher(teacher)
        setIsModalVisible(true)
    }

    const dataSource = (searchText ? filteredData : teachers)?.map(record => ({
        id: record?.id,
        name: record?.name ?? '-',
        group: record?.group ?? '-',
        discipline: record?.discipline ?? '-'
    }))

    const columns = [
        {
            title: 'ФИО',
            dataIndex: 'name'
        },
        {
            title: 'Группа',
            dataIndex: 'group'
        },
        {
            title: 'Предмет',
            dataIndex: 'discipline'
        },
        {
            title: 'Действия',
            render: (_: any, teacher: Collections.Teacher) => (
                <Space>
                    <Button onClick={() => { handleEdit(teacher) }}>
                        <EditOutlined />
                    </Button>
                    <ConfirmDelete
                        handleDelete={async () => { await handleDelete(teacher.id) }}
                        title='Вы уверены, что хотите удалить этого преподавателя?'
                    />
                </Space>
            )
        }
    ]

    return (
        <StyledTeachersListWrapper>
            <Space direction="vertical" style={{ marginBottom: 16, width: '100%' }}>
                <div className="top-row">
                    <Input.Search
                        placeholder="Введите имя или группу"
                        allowClear
                        value={searchText}
                        onChange={(e) => { handleSearch(e.target.value) }}
                        onSearch={handleSearch}
                    />

                    <Button onClick={() => { setIsModalVisible(true) }}>
                        Создать преподавателя
                    </Button>
                </div>
            </Space>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 5 }}
                loading={isLoading}
                rowKey="id"
            />
            <TeacherModal
                open={isModalVisible}
                onClose={handleModalClose}
                onSuccess={handleModalSuccess}
                teacher={editingTeacher}
            />
        </StyledTeachersListWrapper>
    )
}

export default TeachersList
