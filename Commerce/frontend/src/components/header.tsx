import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HeaderActions, HeaderBar, HeaderInner } from '../styles'

const Header = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

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
          <NavLink to="/mypage">마이페이지</NavLink>
        </nav>
        <HeaderActions>
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
          <button type="button" aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'} aria-pressed={dark} onClick={() => setDark(!dark)}>
            <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
          </button>
        </HeaderActions>
      </HeaderInner>
    </HeaderBar>
  )
}

export default Header
