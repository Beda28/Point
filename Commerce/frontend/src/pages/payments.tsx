import { Link } from 'react-router-dom'
import { money, payments, products } from '../data'
import { Stack, TableWrap, TextLink } from '../styles'

const Payments = () => (
  <Stack>
    <h2>결제 내역</h2>
    <TableWrap>
      <table>
        <thead><tr><th>결제일</th><th>상품</th><th>결제 금액</th><th>상태</th><th>상세</th></tr></thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.tid}>
              <td>{payment.created_at}</td>
              <td>{products.find((product) => product.pid === payment.pid)?.pname}</td>
              <td>{money(payment.amount)}원</td>
              <td>{payment.status === 'CANCELED' ? '취소 완료' : '결제 완료'}</td>
              <td><TextLink as={Link} to={`/mypage/payments/${payment.tid}`}>보기</TextLink></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  </Stack>
)

export default Payments
