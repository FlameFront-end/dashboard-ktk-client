import styled from 'styled-components'

export const StyledChatItemSidebarWrapper = styled.div`
    padding: 12px;
    margin: 8px 0;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 160ms ease;
    
    .image {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

    .full_name {
        font-size: 14px;
        color: ${({ theme }) => theme.text};
        max-width: 170px;
        white-space: nowrap;         
        overflow: hidden;            
        text-overflow: ellipsis;      
    }

    .last_message {
        color: ${({ theme }) => theme.text_light};
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.04);
    }

    &.last {
        border-bottom: none;
    }
    
    @media screen and (min-width: 800px){
        &.active {
            background-color: rgba(255, 255, 255, 0.04);

            .last_message {
                color: ${({ theme }) => theme.text};
            }
        } 
    }
`
