import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { isAxiosError } from 'axios'
import client from '../api/client'
import { errorMessage } from '../api/error'
import { getUserId } from '../api/token'
import type { UserData } from '../api/auth'
import { money } from '../data'
import { Balances, Button, Field, Muted, ProfileForm, Stack } from '../styles'

const MyPage = () => {
  const chargeKey = `pending-charge:${getUserId()}`
  const [user, setUser] = useState<UserData | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [charging, setCharging] = useState(false)
  const [charge, setCharge] = useState<{ amount: number; req_key: string } | null>(() => {
    const saved = sessionStorage.getItem(chargeKey)
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    let active = true
    client.get<UserData>('/auth/me')
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

  const topUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (charging || !user) return
    const request = charge ?? {
      amount: Number(new FormData(event.currentTarget).get('amount')),
      req_key: crypto.randomUUID(),
    }
    setCharge(request)
    sessionStorage.setItem(chargeKey, JSON.stringify(request))
    setCharging(true)
    try {
      await client.post('/auth/me/charge', request)
      setCharge(null)
      sessionStorage.removeItem(chargeKey)
      alert('테스트 금액이 충전되었습니다')
      try {
        const { data } = await client.get<UserData>('/auth/me')
        setUser(data)
      } catch {
        setError('충전은 완료되었지만 잔액을 불러오지 못했습니다. 페이지를 새로고침해주세요.')
      }
    } catch (error) {
      alert(errorMessage(error, '충전 요청에 실패했습니다'))
    } finally {
      setCharging(false)
    }
  }

  if (error) return <p role="alert">{error}</p>
  if (!user) return <p>내 정보를 불러오는 중입니다.</p>

  return <Stack>
    <h2>내 정보</h2>
    <Balances>
      <div>계좌 잔액<strong>{money(user.balance)}원</strong></div>
      <div>보유 포인트<strong>{money(user.point)}P</strong></div>
    </Balances>
    {user.status === 'INACTIVE' && <Muted>비활성화된 계좌입니다.</Muted>}
    {user.can_charge && <ProfileForm onSubmit={topUp}>
      <h2>테스트 충전</h2>
      <Muted>실제 결제 없이 테스트용 계좌 잔액을 추가합니다.</Muted>
      <Field>충전 금액<input name="amount" type="number" min="1" max={Number.MAX_SAFE_INTEGER} step="1" defaultValue={charge?.amount ?? 10000} required disabled={charging || Boolean(charge)} /></Field>
      <Button type="submit" disabled={charging || user.status !== 'ACTIVE'}>{charging ? '충전 중...' : charge ? '충전 재시도' : '테스트 금액 충전'}</Button>
    </ProfileForm>}
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
