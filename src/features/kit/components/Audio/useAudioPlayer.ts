import { useState, useEffect } from 'react'

interface UseAudioPlayerReturn {
    curTime: number | undefined
    duration: number | undefined
    playing: boolean
    setPlaying: (playing: boolean) => void
    setClickedTime: (time: number | null) => void
}

const useAudioPlayer = (id: string | number): UseAudioPlayerReturn => {
    const [duration, setDuration] = useState<number | undefined>()
    const [curTime, setCurTime] = useState<number | undefined>()
    const [playing, setPlaying] = useState<boolean>(false)
    const [clickedTime, setClickedTime] = useState<number | null>(null)

    useEffect(() => {
        const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement

        const setAudioData = (): void => {
            console.log('audio.duration', audio.duration)
            setDuration(audio.duration)
            setCurTime(audio.currentTime)
        }

        const setAudioTime = (): void => { setCurTime(audio.currentTime) }

        audio.addEventListener('loadeddata', setAudioData)
        audio.addEventListener('timeupdate', setAudioTime)

        if (playing) {
            void audio.play()
        } else {
            audio.pause()
        }

        if (clickedTime !== null && clickedTime !== curTime) {
            audio.currentTime = clickedTime
            setClickedTime(null)
        }

        return () => {
            audio.removeEventListener('loadeddata', setAudioData)
            audio.removeEventListener('timeupdate', setAudioTime)
        }
    }, [playing, clickedTime, curTime, id])

    return {
        curTime,
        duration,
        playing,
        setPlaying,
        setClickedTime
    }
}

export default useAudioPlayer
