import { Link } from 'react-router-dom'
import { Button, Field, Form, Muted, TextLink } from '../styles'

const Signup = () => (
  <Form onSubmit={(event) => event.preventDefault()}>
    <h1>회원가입</h1>
    <Field>아이디<input name="id" autoComplete="username" /></Field>
    <Field>비밀번호<input name="password" type="password" autoComplete="new-password" /></Field>
    <Field>비밀번호 확인<input name="passwordConfirm" type="password" autoComplete="new-password" /></Field>
    <Button type="submit">회원가입</Button>
    <Muted>이미 계정이 있으신가요? <TextLink as={Link} to="/login">로그인</TextLink></Muted>
  </Form>
)

export default Signup
