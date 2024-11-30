import { type FC, type MouseEvent } from 'react'
import moment from 'moment'

interface BarProps {
    duration: number
    curTime: number
    onTimeUpdate: (time: number) => void
}

const Bar: FC<BarProps> = ({ duration, curTime, onTimeUpdate }) => {
    const curPercentage = (curTime / duration) * 100

    const formatDuration = (duration: number): string => {
        if (isNaN(duration)) {
            return '00:00'
        }

        return moment
            .utc(moment.duration(duration, 'seconds').asMilliseconds())
            .format('mm:ss')
    }

    const calcClickedTime = (e: MouseEvent<HTMLDivElement>): number => {
        const clickPositionInPage = e.pageX
        const bar = document.querySelector('.bar__progress') as HTMLElement
        const barStart = bar.getBoundingClientRect().left + window.scrollX
        const barWidth = bar.offsetWidth
        const clickPositionInBar = clickPositionInPage - barStart
        const timePerPixel = duration / barWidth
        return timePerPixel * clickPositionInBar
    }

    const handleTimeDrag = (e: MouseEvent<HTMLDivElement>): void => {
        onTimeUpdate(calcClickedTime(e))

        const updateTimeOnMove = (eMove: globalThis.MouseEvent): void => {
            onTimeUpdate(calcClickedTime(eMove as unknown as MouseEvent<HTMLDivElement>))
        }

        document.addEventListener('mousemove', updateTimeOnMove)

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', updateTimeOnMove)
        }, { once: true })
    }

    return (
        <div className="bar">
            <span className="bar__time">{formatDuration(curTime)}</span>
            <div
                className="bar__progress"
                style={{
                    background: `linear-gradient(to right, orange ${curPercentage}%, white 0)`
                }}
                onMouseDown={e => { handleTimeDrag(e) }}
            >
                <span
                    className="bar__progress__knob"
                    style={{ left: `${curPercentage - 2}%` }}
                />
            </div>
            <span className="bar__time">{formatDuration(duration)}</span>
        </div>
    )
}

export default Bar
