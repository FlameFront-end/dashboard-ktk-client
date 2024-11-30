import styled from 'styled-components'

export const StyledChatWrapper = styled.div`
    position: relative;
    width: 100%;
    background-color: ${({ theme }) => theme.card.background};
    border: 1px solid ${({ theme }) => theme.card.border};
    border-radius: 0 10px 10px 0;
    height: 100vh;
    overflow-y: hidden !important;

    padding: 20px 20px 50px;

    @media screen and (max-width: 800px) {
        padding: 10px;
        border: none;
        border-radius: 0;

        .back {
            display: block;
        }
    }

    .back {
        display: none;
    }

    .wrapper-chat {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding-bottom: 50px;
    }

    .list {
        margin-top: 60px;
        overflow-y: scroll !important;
        padding: 0 30px;

        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }

        @media screen and (max-width: 800px) {
            padding: 0;
        }
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

    .reply-message {
        margin-top: 5px;
    }

    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28px !important;
        height: 30px !important;

        svg {
            font-size: 18px;
        }
    }


    .btn {
        width: 30px !important;
        height: 30px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3px;
        background-color: #292929;
        color: ${({ theme }) => theme.text};
        border: none;

        &:hover {
            background-color: transparent !important;
            border: none
        }
    }

    .scroll-btn {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 38px;
        height: 38px;
        position: absolute;
        right: 40px;
        bottom: 100px;
        border: 1px solid #363738;
        border-radius: 50%;

        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%227%22%20viewBox%3D%220%200%2014%207%22%20width%3D%2214%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.64.232c-.424-.354-1.055-.296-1.408.128s-.296%201.055.128%201.408l6%205c.371.309.91.309%201.28%200l6-5c.424-.354.482-.984.128-1.408s-.984-.482-1.408-.128l-5.36%204.467z%22%20fill%3D%22%23656565%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: center center;

        &:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
            border: 1px solid #363738;
        }
    }

    .no_select_chat {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
`
