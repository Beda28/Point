import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../api/token'
import { HeaderActions, HeaderBar, HeaderInner } from '../styles'

const Header = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  useLocation()
  const loggedIn = Boolean(getToken())
  const navigate = useNavigate()

  const logout = () => {
    clearToken()
    alert('로그아웃되었습니다')
    navigate('/', { replace: true })
  }

  useEffect(() => {
    const theme = dark ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [dark])

  return (
    <HeaderBar>
      <HeaderInner>
        <Link to="/"><strong>COMMERCE</strong></Link>
        <nav aria-label="주 메뉴">
          <NavLink to="/products">상품</NavLink>
        </nav>
        <HeaderActions>
          {loggedIn ? <>
            <Link to="/mypage">마이페이지</Link>
            <button type="button" onClick={logout}>로그아웃</button>
          </> : <>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>}
          <button type="button" aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'} aria-pressed={dark} onClick={() => setDark(!dark)}>
            <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
          </button>
        </HeaderActions>
      </HeaderInner>
    </HeaderBar>
  )
}

export default Header
