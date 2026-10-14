import { NavLink, Outlet } from 'react-router-dom'
import { AccountLayout, Stack } from '../styles'

const MyPageLayout = () => (
  <Stack>
    <h1>마이페이지</h1>
    <AccountLayout>
      <nav aria-label="마이페이지 메뉴">
        <NavLink to="/mypage" end>내 정보</NavLink>
        <NavLink to="/mypage/payments">결제 내역</NavLink>
      </nav>
      <Outlet />
    </AccountLayout>
  </Stack>
)

export default MyPageLayout
