import styled from 'styled-components'
import { App, Layout } from 'antd'

export const StyledLayout = styled(Layout)`
    min-height: 100vh;
    max-width: calc(920px + 200px + 50px);
    display: flex;
    gap: 16px;
    background-color: #141414;
    margin: 0 auto;

    @media screen and (max-width: 800px) {
        padding-bottom: 0;
    }
`

export const StyledApp = styled(App)`

`

export const StyledContent = styled(Layout.Content)`
    margin: 16px 16px 0;
    background-color: #141414;
    
    @media screen and (max-width: 800px){
        margin: 0;
    }
`
