import { type FC } from 'react'
import { AvatarStyledWrapper } from './Avatar.styled.tsx'
import { Avatar as AvatarAnt } from 'antd'
import defaultAva from '../../../../../public/ava.png'
import dayjs from 'dayjs'

interface Props {
    ava: string | null | undefined
    size: 'ultraSmall' | 'small' | 'medium' | 'large'
    status?: boolean | null
    lastSeen?: string | null
    showStatus?: boolean
    showLastSeen?: boolean
}

const Avatar: FC<Props> = ({
    ava,
    size,
    status,
    lastSeen,
    showStatus = false,
    showLastSeen = false
}) => {
    const sizes = {
        ultraSmall: 35,
        small: 48,
        medium: 72,
        large: 128
    }

    const timeDifference = (lastSeen: string): string => {
        const now = dayjs()
        const lastSeenTime = dayjs(lastSeen)
        const diffInMinutes = now.diff(lastSeenTime, 'minute')
        const diffInHours = now.diff(lastSeenTime, 'hour')

        if (diffInMinutes < 60) {
            return `${diffInMinutes} мин`
        } else if (diffInHours < 12) {
            return `${diffInHours} ч`
        } else {
            return lastSeenTime.format('DD:MM')
        }
    }

    return (
        <AvatarStyledWrapper size={size}>
            {showStatus && (
                <div className='absolute-content'>
                    {status ? (
                        <div className='online' />
                    ) : (
                        showLastSeen && lastSeen && (
                            <div className='last'>{timeDifference(lastSeen)}</div>
                        )
                    )}
                </div>
            )}
            <AvatarAnt size={sizes[size]} src={ava ?? defaultAva} />
        </AvatarStyledWrapper>
    )
}

export default Avatar
