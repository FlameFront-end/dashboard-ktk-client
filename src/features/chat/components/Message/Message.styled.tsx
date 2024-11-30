import styled from 'styled-components'
import { List } from 'antd'

export const StyledMessage = styled(List.Item)`
    position: relative;
    width: 100%;
    border: none !important;
    
    border-radius: 12px;
    margin-bottom: 5px;
    
    @media screen and (hover: hover){
        &:hover {
            background-color: rgba(255, 255, 255, 0.02);
        }
    }
    
    &.active {
        background-color: rgba(255, 255, 255, 0.02);
    }
    
    .marks-read {
        position: relative;
        
        .last {
            position: absolute;
            top: 50%;
            left: 7px;
            transform: translateY(-50%);
        }
        
        svg {   
            fill: #0dcaf0;
        }
    }
    
    .wrapper {
        width: 100%;
        padding: 0 10px
    }
    
    .full-width {
        width: 100%;
    }
    
    .nick {
        font-size: 16px;
        cursor: pointer;
        color: ${({ theme }) => theme.accent};
    }

    .time {
        font-size: 12px;
        color: ${({ theme }) => theme.text_light};
    }

    .message {
        margin-top: 10px;
        color: ${({ theme }) => theme.text};
        word-wrap: anywhere;
        max-width: 700px;
    }

    .audio-player {
        width: 100%; 
        height: 16px;
        outline: none; 
    }
    
    .reply-message {
        margin-top: 5px;

        .message {
            margin-top: 0;
        }
        
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
    
    .swipe-button {
        width: 60px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 50%;
        justify-content: center;
        align-items: center;
        transition: display 0.3s ease
    }
`
