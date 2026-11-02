import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import client from '../api/client'
import { errorMessage } from '../api/error'
import { paymentStatus } from '../api/transactions'
import type { TransactionData } from '../api/transactions'
import { money } from '../data'
import { Button, Muted, Row, Stack, Summary, TextLink } from '../styles'

const Payment = () => {
  const { tid } = useParams()
  const [payment, setPayment] = useState<TransactionData | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    client.get<TransactionData>(`/transactions/${tid}`)
      .then(({ data }) => { if (active) { setPayment(data); setError('') } })
      .catch((error) => { if (active) setError(errorMessage(error, '결제 정보를 불러오지 못했습니다')) })
    return () => { active = false }
  }, [tid])

  const submit = async (action: 'pay' | 'cancel' | 'confirm') => {
    if (pending) return
    if (action === 'cancel' && !confirm('결제를 취소하시겠습니까?')) return
    if (action === 'confirm' && !confirm('구매확정하면 판매자 정산과 포인트 적립이 완료되며 일반 취소가 제한됩니다. 확정하시겠습니까?')) return
    setPending(true)
    try {
      const { data } = await client.post<TransactionData>(`/transactions/${tid}/${action}`)
      setPayment(data)
      alert(action === 'pay' ? '결제가 완료되었습니다' : action === 'confirm' ? '구매확정과 포인트 적립이 완료되었습니다' : '결제가 취소되었습니다')
    } catch (error) {
      alert(errorMessage(error, '요청에 실패했습니다') + '\n이 화면에서 같은 주문으로 다시 시도해주세요.')
      try {
        const { data } = await client.get<TransactionData>(`/transactions/${tid}`)
        setPayment(data)
      } catch {
        setError('결제 상태를 확인하지 못했습니다. 페이지를 새로고침해주세요.')
      }
    } finally {
      setPending(false)
    }
  }

  if (error) return <p role="alert">{error}</p>
  if (!payment || payment.tid !== tid) return <p>결제 정보를 불러오는 중입니다.</p>

  return <Stack>
    <h2>결제 상세</h2>
    <Summary>
      <div><dt>주문 번호</dt><dd>{payment.tid}</dd></div>
      <div><dt>주문일</dt><dd>{new Date(payment.created_at).toLocaleString('ko-KR')}</dd></div>
      <div><dt>상태</dt><dd>{paymentStatus[payment.status]}</dd></div>
      <div><dt>상품</dt><dd><TextLink as={Link} to={`/products/${payment.pid}`}>상품 보기</TextLink></dd></div>
      <div><dt>주문 당시 단가</dt><dd>{money(payment.unit_price)}원</dd></div>
      <div><dt>수량</dt><dd>{payment.quantity}</dd></div>
      <div><dt>합계</dt><dd>{money(payment.total_amount)}원</dd></div>
      <div><dt>사용 포인트</dt><dd>{money(payment.point_used)}P</dd></div>
      <div><dt>계좌 결제 금액</dt><dd>{money(payment.amount)}원</dd></div>
      <div><dt>{payment.status === 'CONFIRMED' ? '적립 포인트' : '구매확정 시 적립'}</dt><dd>{money(payment.status === 'CANCELED' ? '0' : payment.point_earned)}P</dd></div>
    </Summary>
    {payment.status === 'PAYING' && <Muted>결제 결과 확인이 필요합니다. 아래 버튼으로 같은 주문의 결제를 재시도해주세요.</Muted>}
    {payment.status === 'REFUNDING' && <Muted>취소 결과 확인이 필요합니다. 아래 버튼으로 같은 주문의 취소를 재시도해주세요.</Muted>}
    {payment.status === 'CONFIRMING' && <Muted>구매확정 결과 확인이 필요합니다. 아래 버튼으로 같은 주문의 구매확정을 재시도해주세요.</Muted>}
    {payment.status === 'CONFIRMED' && <Muted>판매자 정산과 포인트 적립이 완료되었습니다. 구매확정된 주문은 일반 취소할 수 없습니다.</Muted>}
    {payment.status === 'CANCELED' && <Muted>결제 금액과 사용 포인트가 계좌로 반환되었습니다.</Muted>}
    <Row>
      {(payment.status === 'PENDING' || payment.status === 'PAYING') && <Button disabled={pending} onClick={() => submit('pay')}>{pending ? '처리 중...' : payment.status === 'PAYING' ? '결제 재시도' : '결제하기'}</Button>}
      {(payment.status === 'COMPLETED' || payment.status === 'REFUNDING') && <Button disabled={pending} onClick={() => submit('cancel')}>{pending ? '처리 중...' : payment.status === 'REFUNDING' ? '취소 재시도' : '결제 취소'}</Button>}
      {(payment.status === 'COMPLETED' || payment.status === 'CONFIRMING') && <Button disabled={pending} onClick={() => submit('confirm')}>{pending ? '처리 중...' : payment.status === 'CONFIRMING' ? '구매확정 재시도' : '구매확정'}</Button>}
      <TextLink as={Link} to="/mypage/payments">결제 내역으로</TextLink>
    </Row>
  </Stack>
}

export default Payment
