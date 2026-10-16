import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import client from '../api/client'
import { setToken } from '../api/token'
import { Button, Field, Form, Muted, TextLink } from '../styles'

const Signup = () => {
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (form.get('password') !== form.get('passwordConfirm')) {
      alert('비밀번호가 일치하지 않습니다')
      return
    }
    setPending(true)
    try {
      const { data } = await client.post<{ access_token: string }>('/auth/register', {
        id: form.get('id'),
        pw: form.get('password'),
      })
      setToken(data.access_token)
      alert('회원가입이 완료되었습니다. 로그인되었습니다')
      navigate('/', { replace: true })
    } catch (error) {
      alert(isAxiosError(error) && error.response?.data.message || '회원가입 요청에 실패했습니다')
    } finally {
      setPending(false)
    }
  }

  return <Form onSubmit={submit}>
    <h1>회원가입</h1>
    <Field>아이디<input name="id" autoComplete="username" /></Field>
    <Field>비밀번호<input name="password" type="password" autoComplete="new-password" /></Field>
    <Field>비밀번호 확인<input name="passwordConfirm" type="password" autoComplete="new-password" /></Field>
    <Button type="submit" disabled={pending}>{pending ? '가입 중...' : '회원가입'}</Button>
    <Muted>이미 계정이 있으신가요? <TextLink as={Link} to="/login">로그인</TextLink></Muted>
  </Form>
}

export default Signup
