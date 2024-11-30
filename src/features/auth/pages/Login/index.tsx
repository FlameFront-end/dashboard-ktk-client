import { type FC, useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { regExpPassword } from '@/utils'
import { useAppAction } from '@/hooks'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../api/auth.api'
import type { LoginPayload } from '../../types/login.types'
import { authPaths } from '../../routes/auth.paths.ts'
import { BACKEND_URL } from '@/constants'
import { Card, TextButton } from '@/kit'

import { StyledAuthWrapper } from '../styled/Auth.styled.tsx'

const Login: FC = () => {
    const navigate = useNavigate()
    const { setUser } = useAppAction()
    const [login, { isLoading }] = useLoginMutation()

    const [form] = Form.useForm()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')

        if (token) {
            axios.get(`${BACKEND_URL}/auth/validate-token/${token}`)
                .then(response => {
                    toast.success('Успешный вход в аккаунт')
                    setUser(response.data)
                })
                .catch(() => {
                    toast.error('Что-то пошло не так')
                })
        }
    }, [])

    const handleFinish = async (payload: LoginPayload): Promise<void> => {
        const response = await login(payload)

        if (!('error' in response)) {
            const result = response?.data
            setUser(result)
            form.resetFields()
            toast.success('Успешный вход в аккаунт')
        } else {
            toast.error('Что-то пошло не так')
        }
    }

    return (
        <StyledAuthWrapper>
            <Card>
                <Form
                    form={form}
                    name='login'
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 400, margin: '0 auto' }}
                    onFinish={(data: LoginPayload) => {
                        void handleFinish(data)
                    }}
                    autoComplete='off'
                >
                    <Form.Item
                        className='form-item'
                        label='Email'
                        name='email'
                        hasFeedback
                        validateDebounce={600}
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'The input is not valid email!' }
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label='Password'
                        name='password'
                        hasFeedback
                        validateDebounce={600}
                        rules={[
                            {
                                validator: async (_, value) => {
                                    if (value === undefined || value === '') {
                                        await Promise.reject(new Error('Please input your password!'))
                                    } else if (!regExpPassword.test(value)) {
                                        await Promise.reject(new Error('The password must be at least 9 characters and contain capital letters, numbers and special characters, such as "#@&".'))
                                    }
                                }
                            }
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit' loading={isLoading} block>
                            Войти
                        </Button>
                    </Form.Item>

                    <label>
                        Ещё не зарегстрированы? <TextButton onClick={() => { navigate(authPaths.register) }}>Регистрация</TextButton>
                    </label>
                </Form>
            </Card>
        </StyledAuthWrapper>

    )
}

export default Login
