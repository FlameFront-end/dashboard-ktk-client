import styled from 'styled-components'

export const StyledChatListWrapper = styled.div`
    overflow-y: auto;
    width: 100%;
    height: 100%;
    max-width: 250px;
    padding: 0 8px;

    background-color: ${({ theme }) => theme.card.background};
    border: 1px solid ${({ theme }) => theme.card.border};

    border-right: none;
    border-radius: 10px 0 0 10px;
    
    @media screen and (max-width: 800px){
        max-width: 100%;
        border-radius: 0;
        border: none;
    }

    .spinner-wrapper {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .no_chats {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
`
