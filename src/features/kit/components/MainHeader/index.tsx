import { type FC } from 'react'
import { StyledMainHeader } from './MainHeader.styled.tsx'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/hooks'
import { pathsConfig } from '@/pathsConfig'

const MainHeader: FC = () => {
    const user = useAppSelector(state => state.auth.user)

    return (
        <StyledMainHeader>
            <div className="content">
                <Link to={pathsConfig.root}>
                    Социальная сеть
                </Link>

                {user.name ?? ''}
            </div>
        </StyledMainHeader>
    )
}

export default MainHeader
