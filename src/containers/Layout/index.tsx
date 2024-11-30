import { type FC } from 'react'
import { Outlet } from 'react-router-dom'
import { StyledContent, StyledLayout } from './Layout.styled.tsx'
import { Sidebar } from '@/components'

const Layout: FC = () => {
    return (
        <>
            {/* <MainHeader/> */}
            <StyledLayout hasSider>
                <Sidebar />
                <StyledContent>
                    <Outlet />
                </StyledContent>
            </StyledLayout>
        </>

    )
}

export default Layout
