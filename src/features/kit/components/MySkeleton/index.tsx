import { type FC } from 'react'

import Skeleton from 'react-loading-skeleton'

interface Props {
    height: number | string
    width?: number | string
    borderRadius?: number
}

const MySkeleton: FC<Props> = ({ height, width, borderRadius = 10 }) => {
    return <Skeleton baseColor="#202020" highlightColor="#444" style={{ borderRadius, height, width }}/>
}

export default MySkeleton
