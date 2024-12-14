import styled from 'styled-components'

export const StyledScheduleTableWrapper = styled.div`
    overflow-x: auto;
    max-width: 100%;
    
    .highlight-cell {
        border: 1px solid red !important; 
        border-inline-end: 1px solid red !important;
    }

    .ant-table {
        min-width: 800px; 
    }
    
    @media screen and (max-width: 500px){
        .ant-table-cell {
            padding: 8px !important;
        }
    }
`
