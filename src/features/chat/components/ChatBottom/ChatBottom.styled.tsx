import styled from 'styled-components'
import Flex from '../../../kit/components/Flex'

export const StyledChatBottom = styled(Flex)`
    width: calc(100% - 540px);
    max-width: calc(670px - 20px - 20px);
    position: fixed;
    margin: 10px 0;
    bottom: 30px;
    padding: 10px;
    background-color: #292929;
    border-radius: 12px;
    -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.30), 0 4px 16px 0 rgba(0, 0, 0, 0.30);
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.30), 0 4px 16px 0 rgba(0, 0, 0, 0.30);

    @media screen and (max-width: 800px) {
        bottom: 0;
        width: calc(100% - 20px);
        max-width: 100%;
    }
    
    .wrapper {
        width: 100%;
    }

    .reply {
        padding: 0 11px;

        .separator {
            grid-area: separator;
            width: 2px;
            border-radius: 2px;
            background-color: ${({ theme }) => theme.accent};
        }

        .author {
            color: ${({ theme }) => theme.accent};
        }
    }
    
    .emoji-picker {
        position: absolute;
        right: 0;
        bottom: 40px;
        z-index: 700;
        padding-bottom: 15px;
    }
    
    .typing {
        padding-left: 10px;
    }
    
    input {
        width: 100%;
        background-color: #292929 !important;
        border: none !important;
        outline: none !important;

        &:active, &:focus {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
        }
    }
    
    .selected-messages {
        button {
            padding: 5px;
        }
    }
`
