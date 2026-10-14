import { Link, useParams } from 'react-router-dom'
import { money, payments, products } from '../data'
import { Button, Row, Stack, Summary, TextLink } from '../styles'

const Payment = () => {
  const { tid } = useParams()
  const payment = payments.find((item) => item.tid === tid)
  if (!payment) return <p>결제 내역을 찾을 수 없습니다.</p>
  const product = products.find((item) => item.pid === payment.pid)

  return (
    <Stack>
      <Row><h2>결제 상세</h2><TextLink as={Link} to="/mypage/payments">목록으로</TextLink></Row>
      <Summary>
        <div><dt>거래 번호</dt><dd>{payment.tid}</dd></div>
        <div><dt>결제일</dt><dd>{payment.created_at}</dd></div>
        <div><dt>상품</dt><dd><TextLink as={Link} to={`/products/${payment.pid}`}>{product?.pname}</TextLink></dd></div>
        <div><dt>수량</dt><dd>{payment.quantity}개</dd></div>
        <div><dt>상품 금액</dt><dd>{money(payment.total_amount)}원</dd></div>
        <div><dt>사용 포인트</dt><dd>{money(payment.point_used)}P</dd></div>
        <div><dt>결제 금액</dt><dd>{money(payment.amount)}원</dd></div>
        <div><dt>상태</dt><dd>{payment.status === 'CANCELED' ? '취소 완료' : '결제 완료'}</dd></div>
      </Summary>
      {payment.status === 'COMPLETED' && <Button type="button">결제 취소</Button>}
    </Stack>
  )
}

export default Payment
