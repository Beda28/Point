import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import client from '../api/client'
import type { ProductData } from '../api/products'
import { getToken, getUserId } from '../api/token'
import { Button, Field, Form, TextLink } from '../styles'

const ProductForm = () => {
  const { pid } = useParams()
  const navigate = useNavigate()
  const loggedIn = Boolean(getToken())
  const [product, setProduct] = useState({ pname: '', price: '', content: '' })
  const [loading, setLoading] = useState(Boolean(pid))
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loggedIn) {
      alert('로그인이 필요합니다')
      navigate('/login', { replace: true })
      return
    }
    if (!pid) return
    let active = true
    client.get<ProductData>(`/products/${pid}`)
      .then(({ data }) => {
        if (!active) return
        if (data.uid !== getUserId()) {
          alert('본인이 등록한 상품만 수정할 수 있습니다')
          navigate(`/products/${pid}`, { replace: true })
          return
        }
        setProduct(data)
      })
      .catch(() => { if (active) setError('상품을 불러오지 못했습니다') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [pid, loggedIn, navigate])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    const { pname, price, content } = product
    try {
      const { data } = pid
        ? await client.put<ProductData>(`/products/${pid}`, { pname, price, content })
        : await client.post<ProductData>('/products', { pname, price, content })
      alert(pid ? '상품이 수정되었습니다' : '상품이 등록되었습니다')
      navigate(`/products/${data.pid}`, { replace: true })
    } catch (error) {
      alert(isAxiosError(error) && error.response?.data.message || '상품 저장에 실패했습니다')
    } finally {
      setPending(false)
    }
  }

  if (!loggedIn) return null
  if (error) return <p role="alert">{error}</p>
  if (loading) return <p>상품을 불러오는 중입니다.</p>

  return <Form onSubmit={submit}>
    <h1>{pid ? '상품 수정' : '상품 등록'}</h1>
    <Field>상품명<input name="pname" value={product.pname} onChange={(event) => setProduct({ ...product, pname: event.target.value })} required /></Field>
    <Field>가격<input name="price" type="number" min="0" step="1" value={product.price} onChange={(event) => setProduct({ ...product, price: event.target.value })} required /></Field>
    <Field>설명<textarea name="content" rows={6} value={product.content} onChange={(event) => setProduct({ ...product, content: event.target.value })} /></Field>
    <Button type="submit" disabled={pending}>{pending ? '저장 중...' : '저장'}</Button>
    <TextLink as={Link} to={pid ? `/products/${pid}` : '/products'}>취소</TextLink>
  </Form>
}

export default ProductForm
