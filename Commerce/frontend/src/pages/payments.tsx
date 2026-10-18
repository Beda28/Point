import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { errorMessage } from '../api/error'
import { paymentStatus } from '../api/transactions'
import type { TransactionData } from '../api/transactions'
import { money } from '../data'
import { Balances, Muted, Stack, TableWrap, TextLink } from '../styles'

const Payments = ({ sales = false }: { sales?: boolean }) => {
  const [payments, setPayments] = useState<TransactionData[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    client.get<TransactionData[]>(sales ? '/transactions/sales' : '/transactions')
      .then(({ data }) => { if (active) setPayments(data) })
      .catch((error) => { if (active) setError(errorMessage(error, '결제 내역을 불러오지 못했습니다')) })
    return () => { active = false }
  }, [sales])

  if (error) return <p role="alert">{error}</p>
  if (!payments) return <p>결제 내역을 불러오는 중입니다.</p>

  return <Stack>
    <h2>{sales ? '판매 · 정산 내역' : '결제 내역'}</h2>
    {sales && <>
      <Muted>구매확정 시 수수료를 제외한 금액이 계좌에 입금됩니다. 포인트 할인액은 플랫폼이 부담합니다.</Muted>
      <Balances>
        <div>정산 예정<strong>{money(String(payments.filter((p) => p.status === 'COMPLETED' || p.status === 'CONFIRMING').reduce((sum, p) => sum + BigInt(p.seller_amount), 0n)))}원</strong></div>
        <div>정산 완료<strong>{money(String(payments.filter((p) => p.status === 'CONFIRMED').reduce((sum, p) => sum + BigInt(p.seller_amount), 0n)))}원</strong></div>
      </Balances>
    </>}
    {payments.length ? <TableWrap>
      <table>
        <thead><tr><th>주문일</th><th>수량</th><th>{sales ? '판매금액' : '결제 금액'}</th><th>{sales ? '수수료' : '사용 포인트'}</th>{sales && <th>정산금액</th>}<th>상태</th><th>상세</th></tr></thead>
        <tbody>{payments.map((payment) => <tr key={payment.tid}>
          <td>{new Date(payment.created_at).toLocaleString('ko-KR')}</td>
          <td>{payment.quantity}</td>
          <td>{money(sales ? payment.total_amount : payment.amount)}원</td>
          <td>{sales ? `${money(payment.status === 'CANCELED' || payment.status === 'FAILED' ? '0' : payment.fee)}원` : `${money(payment.point_used)}P`}</td>
          {sales && <td>{money(payment.status === 'CANCELED' || payment.status === 'FAILED' ? '0' : payment.seller_amount)}원</td>}
          <td>{paymentStatus[payment.status]}</td>
          <td><TextLink as={Link} to={sales ? `/products/${payment.pid}` : `/mypage/payments/${payment.tid}`}>{sales ? '상품 보기' : '보기'}</TextLink></td>
        </tr>)}</tbody>
      </table>
    </TableWrap> : <Muted>{sales ? '판매 내역이 없습니다.' : '결제 내역이 없습니다.'}</Muted>}
  </Stack>
}

export default Payments
