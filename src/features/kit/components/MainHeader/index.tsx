import { type FC } from 'react'
import { StyledMainHeader } from './MainHeader.styled.tsx'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/hooks'
import { pathsConfig } from '@/pathsConfig'
import { getFullName } from '@/utils'

const MainHeader: FC = () => {
    const user = useAppSelector(state => state.auth.user)

    return (
        <StyledMainHeader>
            <div className="content">
                <Link to={pathsConfig.root}>
                    Социальная сеть
                </Link>

              {getFullName(user.surname ?? '', user.name ?? '', null)}
            </div>
        </StyledMainHeader>
    )
}

export default MainHeader
