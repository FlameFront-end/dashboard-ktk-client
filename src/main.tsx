import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ConfigProvider, message } from 'antd'
import { ThemeProvider } from 'styled-components'
import { ToastContainer } from 'react-toastify'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ru_RU from 'antd/lib/locale/ru_RU'

import reportWebVitals from './reportWebVitals'
import RouterProvider from './router/RouterProvider'
import { StyledApp } from './containers/Layout/Layout.styled.tsx'
import { store } from './store/configureStore.ts'
import { darkTheme, antdTheme } from '@/core'

import 'antd/dist/reset.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import './assets/css/scrollbar.css'
import './assets/css/reset.css'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

dayjs.locale('ru')

message.config({
    duration: 2
})

root.render(
    <Provider store={store}>
        <ThemeProvider theme={darkTheme}>
            <ConfigProvider theme={antdTheme} locale={ru_RU}>
                <StyledApp>
                    <ToastContainer autoClose={2000} theme='dark'/>
                    <RouterProvider />
                </StyledApp>
            </ConfigProvider>
        </ThemeProvider>
    </Provider>
)

reportWebVitals()
