import { type FC } from 'react'
import { OnlineStatusStyledWrapper } from './OnlineStatus.styled.tsx'

interface Props {
    status: boolean | null
}

const OnlineStatus: FC<Props> = ({ status }) => {
    return (
        <OnlineStatusStyledWrapper status={status}>
            {status ? 'В сети' : 'Не в сети'}
        </OnlineStatusStyledWrapper>
    )
}

export default OnlineStatus
