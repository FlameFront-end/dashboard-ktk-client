import styled from 'styled-components'

interface WrapperProps {
    size: 'ultraSmall' | 'small' | 'medium' | 'large'
}

const statusSizes = {
    ultraSmall: '8px',
    small: '10px',
    medium: '15px',
    large: '20px'
}

export const AvatarStyledWrapper = styled.div<WrapperProps>`
    position: relative;
    width: max-content;
    
    .absolute-content {
        position: absolute;
        bottom: 15%;
        right: 15%;
        transform: translate(50%, 50%);
        z-index: 1;
    }
    
    .online {
        width: ${({ size }) => statusSizes[size]};
        height: ${({ size }) => statusSizes[size]};
        border-radius: 50%;
        background-color: #4bb34b;
    }
    
    .last {
        border-radius: 9px;
        background-color: #656565;
        font-weight: 700;
        font-size: 12px;
        padding: 2px 4px 2px;
    }
`
