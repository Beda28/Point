import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { getToken } from '../api/token'
import { AccountLayout, Stack } from '../styles'

const MyPageLayout = () => {
  const navigate = useNavigate()
  const loggedIn = Boolean(getToken())

  useEffect(() => {
    if (!loggedIn) {
      alert('로그인이 필요합니다')
      navigate('/login', { replace: true })
    }
  }, [loggedIn, navigate])

  if (!loggedIn) return null

  return <Stack>
    <h1>마이페이지</h1>
    <AccountLayout>
      <nav aria-label="마이페이지 메뉴">
        <NavLink to="/mypage" end>내 정보</NavLink>
        <NavLink to="/mypage/products">내가 등록한 상품</NavLink>
        <NavLink to="/mypage/payments">결제 내역</NavLink>
      </nav>
      <Outlet />
    </AccountLayout>
  </Stack>
}

export default MyPageLayout
