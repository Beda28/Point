import { Link } from 'react-router-dom'
import { Button, Field, Form, Muted, TextLink } from '../styles'

const Login = () => (
  <Form onSubmit={(event) => event.preventDefault()}>
    <h1>로그인</h1>
    <Field>아이디<input name="id" autoComplete="username" /></Field>
    <Field>비밀번호<input name="password" type="password" autoComplete="current-password" /></Field>
    <Button type="submit">로그인</Button>
    <Muted>계정이 없으신가요? <TextLink as={Link} to="/signup">회원가입</TextLink></Muted>
  </Form>
)

export default Login
