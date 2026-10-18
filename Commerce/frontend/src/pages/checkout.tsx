import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import client from '../api/client'
import { errorMessage } from '../api/error'
import { getToken } from '../api/token'
import type { UserData } from '../api/auth'
import type { ProductData } from '../api/products'
import type { PaymentPolicy, TransactionData } from '../api/transactions'
import ProductLayout from '../components/product-layout'
import { money } from '../data'
import { Button, Field, Muted, ProfileForm, Summary, TextLink } from '../styles'

const Checkout = () => {
  const { pid } = useParams()
  const navigate = useNavigate()
  const loggedIn = Boolean(getToken())
  const [product, setProduct] = useState<ProductData | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [policy, setPolicy] = useState<PaymentPolicy | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [point, setPoint] = useState(0)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loggedIn) {
      alert('로그인이 필요합니다')
      navigate('/login', { replace: true })
      return
    }
    let active = true
    Promise.all([client.get<ProductData>(`/products/${pid}`), client.get<UserData>('/auth/me'), client.get<PaymentPolicy>('/transactions/policy')])
      .then(([product, user, policy]) => {
        if (!active) return
        setProduct(product.data)
        setUser(user.data)
        setPolicy(policy.data)
      })
      .catch((error) => { if (active) setError(errorMessage(error, '결제 정보를 불러오지 못했습니다')) })
    return () => { active = false }
  }, [pid, loggedIn, navigate])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    setPending(true)
    let tid: string | undefined
    try {
      const { data } = await client.post<TransactionData>('/transactions', { pid, quantity, point_used: point })
      tid = data.tid
      if (data.unit_price !== product?.price) {
        alert('상품 가격이 변경되었습니다. 주문 상세에서 금액을 확인한 뒤 결제해주세요.')
        return
      }
      await client.post(`/transactions/${tid}/pay`)
      alert('결제가 완료되었습니다')
    } catch (error) {
      alert(errorMessage(error, '결제 요청에 실패했습니다') + (tid ? '\n결제 상세에서 같은 주문으로 다시 시도해주세요.' : ''))
    } finally {
      if (tid) navigate(`/mypage/payments/${tid}`, { replace: true })
      setPending(false)
    }
  }

  if (!loggedIn) return null
  if (error) return <p role="alert">{error}</p>
  if (!product || !user || !policy) return <p>결제 정보를 불러오는 중입니다.</p>

  const total = BigInt(product.price) * BigInt(Number.isSafeInteger(quantity) ? quantity : 0)
  const discount = BigInt(Number.isSafeInteger(point) ? point : 0) * BigInt(policy.point_value)
  const amount = total - discount
  const reward = amount > 0n ? amount * BigInt(policy.reward_bps) / 10000n : 0n
  const insufficient = amount > BigInt(user.balance)

  return <ProductLayout name={product.pname}>
    <Muted>상품 결제</Muted>
    <h1>{product.pname}</h1>
    <ProfileForm onSubmit={submit}>
      <Field>수량<input name="quantity" type="number" min="1" max="100" step="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} required disabled={pending} /></Field>
      <Field>사용할 포인트<input name="point" type="number" min="0" max={Math.min(Number(user.point), Math.floor(Number(total) / policy.point_value), Number.MAX_SAFE_INTEGER)} step="1" value={point} onChange={(event) => setPoint(Number(event.target.value))} required disabled={pending} /></Field>
      <Muted>1P = {policy.point_value}원 할인 · 포인트 할인 후 결제액의 {policy.reward_bps / 100}% 적립</Muted>
      <Muted>계좌 잔액 {money(user.balance)}원 · 보유 포인트 {money(user.point)}P</Muted>
      <Summary>
        <div><dt>상품 금액</dt><dd>{money(product.price)}원</dd></div>
        <div><dt>합계</dt><dd>{money(String(total))}원</dd></div>
        <div><dt>포인트 할인</dt><dd>-{money(String(discount))}원</dd></div>
        <div><dt>계좌 결제 금액</dt><dd>{money(String(amount))}원</dd></div>
        <div><dt>구매확정 시 적립</dt><dd>{money(String(reward))}P</dd></div>
      </Summary>
      {insufficient && <Muted>계좌 잔액이 부족합니다.</Muted>}
      {user.status === 'INACTIVE' && <Muted>비활성화된 계좌는 결제할 수 없습니다.</Muted>}
      {product.uid === user.uuid && <Muted>본인이 등록한 상품은 구매할 수 없습니다.</Muted>}
      <Muted>구매확정 전에는 취소할 수 있습니다. 구매확정 시 판매자 정산과 포인트 적립이 완료되며 일반 취소가 제한됩니다.</Muted>
      <Button type="submit" disabled={pending || insufficient || user.status !== 'ACTIVE' || product.uid === user.uuid}>{pending ? '결제 중...' : '결제하기'}</Button>
      <TextLink as={Link} to={`/products/${pid}`}>상품으로 돌아가기</TextLink>
    </ProfileForm>
  </ProductLayout>
}

export default Checkout
