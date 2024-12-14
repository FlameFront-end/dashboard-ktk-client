import styled from 'styled-components'
import { Card } from 'antd'

export const StyledStudentsListWrapper = styled(Card)`
    .top-row {
        display: flex;
        justify-content: space-between;
        gap: 30px;
        align-items: center;

        @media screen and (max-width: 600px){
            flex-direction: column;
            align-items: start;
            gap: 10px;
        }
    }
`
