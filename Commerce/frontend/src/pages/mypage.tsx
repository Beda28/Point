import { money, user } from '../data'
import { Balances, Muted, Stack, Summary } from '../styles'

const MyPage = () => (
  <Stack>
    <h2>내 정보</h2>
    <Summary><div><dt>아이디</dt><dd>{user.id}</dd></div></Summary>
    <Balances>
      <div><Muted>계좌 잔액</Muted><strong>{money(user.balance)}원</strong></div>
      <div><Muted>보유 포인트</Muted><strong>{money(user.points)}P</strong></div>
    </Balances>
  </Stack>
)

export default MyPage
