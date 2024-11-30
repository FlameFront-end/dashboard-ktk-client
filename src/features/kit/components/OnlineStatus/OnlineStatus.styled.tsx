import styled from 'styled-components'

interface OnlineStatusProps {
    status: boolean | null
}

export const OnlineStatusStyledWrapper = styled.div<OnlineStatusProps>`
    color: ${({ status }) => (status ? '#1b9e3e' : '#d14343')};
`
