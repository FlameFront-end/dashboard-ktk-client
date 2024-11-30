import { type FC } from 'react'
import { PauseCircleFilled, PlayCircleFilled } from '@ant-design/icons'
import useAudioPlayer from './useAudioPlayer'
import Bar from './Bar'

interface Props {
    url: string
    id: string | number
}

const Audio: FC<Props> = ({ url, id }) => {
    const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer(id)

    return (
        <div className="player">
            <audio id={`audio-${id}`}>
                <source src={url}/>
                Your browser does not support the <code>audio</code> element.
            </audio>
            <div className="controls">
                {playing
                    ? <button onClick={() => { setPlaying(false) }}>
                        <PauseCircleFilled/>
                    </button>
                    : <button onClick={() => { setPlaying(true) }}>
                        <PlayCircleFilled/>
                    </button>
                }
                <Bar curTime={curTime ?? 0} duration={duration ?? 0} onTimeUpdate={(time) => { setClickedTime(time) }}/>
            </div>
        </div>
    )
}

export default Audio
