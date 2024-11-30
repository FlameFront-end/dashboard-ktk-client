import styled from 'styled-components'
import { Flex } from 'antd'

export const ChatListStyledWrapper = styled(Flex)`
    width: 100%;
    height: calc(100vh - 40px);
    overflow-y: hidden !important;
    
    .chat {
        width: 100%;
        display: block;
    }


    @media screen and (max-width: 800px) {
        height: calc(100vh - 70px);
        
        .chat {
            display: none;
        }
    }
`
