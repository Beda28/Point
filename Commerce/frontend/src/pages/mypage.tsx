import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { isAxiosError } from 'axios'
import client from '../api/client'
import { Button, Field, ProfileForm, Stack } from '../styles'

const MyPage = () => {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let active = true
    client.get<{ id: string }>('/auth/me')
      .then(({ data }) => { if (active) setUser(data) })
      .catch((error) => {
        if (active) setError(isAxiosError(error) && error.response?.data.message || '내 정보를 불러오지 못했습니다')
      })
    return () => { active = false }
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (data.get('new_pw') !== data.get('confirm_pw')) {
      alert('새 비밀번호가 일치하지 않습니다')
      return
    }
    setPending(true)
    try {
      await client.patch('/auth/password', { pw: data.get('pw'), new_pw: data.get('new_pw') })
      form.reset()
      alert('비밀번호가 변경되었습니다')
    } catch (error) {
      alert(isAxiosError(error) && error.response?.data.message || '비밀번호 변경에 실패했습니다')
    } finally {
      setPending(false)
    }
  }

  if (error) return <p role="alert">{error}</p>
  if (!user) return <p>내 정보를 불러오는 중입니다.</p>

  return <Stack>
    <h2>내 정보</h2>
    <ProfileForm onSubmit={submit}>
      <Field>아이디<input name="id" value={user.id} autoComplete="username" readOnly /></Field>
      <h2>비밀번호 변경</h2>
      <Field>기존 비밀번호<input name="pw" type="password" autoComplete="current-password" required /></Field>
      <Field>새 비밀번호<input name="new_pw" type="password" autoComplete="new-password" required /></Field>
      <Field>새 비밀번호 확인<input name="confirm_pw" type="password" autoComplete="new-password" required /></Field>
      <Button type="submit" disabled={pending}>{pending ? '변경 중...' : '비밀번호 변경'}</Button>
    </ProfileForm>
  </Stack>
}

export default MyPage
