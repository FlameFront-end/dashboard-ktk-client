import styled from 'styled-components'

export const StyledChatHeader = styled.div`
    position: fixed;
    z-index: 999;
    top: 20px;
    padding: 20px;
    width: calc(100% - 520px);
    max-width: 650px;
    background-color: ${({ theme }) => theme.card.background};


    .back-mobile {
        display: none;
        
        .anticon-arrow-left {
            color: #1890ff;
            font-size: 20px;
        }
    }
    
    @media screen and (max-width: 800px){
        top: 0;
        left: 0;
        width: 100%;
        max-width: 100%;
        
        .back-mobile {
            display: block ;
        }
    }

    
`
