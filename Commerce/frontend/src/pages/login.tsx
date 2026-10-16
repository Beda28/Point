import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import client from '../api/client'
import { setToken } from '../api/token'
import { Button, Field, Form, Muted, TextLink } from '../styles'

const Login = () => {
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setPending(true)
    try {
      const { data } = await client.post<{ access_token: string }>('/auth/login', {
        id: form.get('id'),
        pw: form.get('password'),
      })
      setToken(data.access_token)
      alert('로그인되었습니다')
      navigate('/', { replace: true })
    } catch (error) {
      alert(isAxiosError(error) && error.response?.data.message || '로그인 요청에 실패했습니다')
    } finally {
      setPending(false)
    }
  }

  return <Form onSubmit={submit}>
    <h1>로그인</h1>
    <Field>아이디<input name="id" autoComplete="username" /></Field>
    <Field>비밀번호<input name="password" type="password" autoComplete="current-password" /></Field>
    <Button type="submit" disabled={pending}>{pending ? '로그인 중...' : '로그인'}</Button>
    <Muted>계정이 없으신가요? <TextLink as={Link} to="/signup">회원가입</TextLink></Muted>
  </Form>
}

export default Login
