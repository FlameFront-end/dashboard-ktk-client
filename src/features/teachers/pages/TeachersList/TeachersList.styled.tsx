import styled from 'styled-components'
import { Card } from 'antd'

export const StyledTeachersListWrapper = styled(Card)`
    overflow-x: auto;
    max-width: 100%;

    .ant-table {
        min-width: 800px;
    }
    
    .top-row {
        display: flex;
        justify-content: space-between;
        gap: 30px;
        align-items: center;
    }
`
