import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import client from '../api/client'
import type { ProductData } from '../api/products'
import { getUserId } from '../api/token'
import ProductLayout from '../components/product-layout'
import { money } from '../data'
import { Button, Description, Muted, Row } from '../styles'

const Product = () => {
  const { pid } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let active = true
    client.get<ProductData>(`/products/${pid}`)
      .then(({ data }) => { if (active) setProduct(data) })
      .catch((error) => {
        if (active) setError(isAxiosError(error) && error.response?.data.message || '상품을 불러오지 못했습니다')
      })
    return () => { active = false }
  }, [pid])

  const remove = async () => {
    if (!confirm('상품을 삭제하시겠습니까?')) return
    setPending(true)
    try {
      await client.delete(`/products/${pid}`)
      alert('상품이 삭제되었습니다')
      navigate('/products', { replace: true })
    } catch (error) {
      alert(isAxiosError(error) && error.response?.data.message || '상품 삭제에 실패했습니다')
    } finally {
      setPending(false)
    }
  }

  if (error) return <p role="alert">{error}</p>
  if (!product) return <p>상품을 불러오는 중입니다.</p>

  return <ProductLayout name={product.pname}>
    <Muted>상품 상세</Muted>
    <h1>{product.pname}</h1>
    <Muted>등록일 {new Date(product.created_at).toLocaleDateString('ko-KR')}</Muted>
    <h2>{money(product.price)}원</h2>
    <Description>{product.content}</Description>
    {getUserId() !== product.uid && <Button as={Link} to={`/products/${pid}/checkout`}>구매하기</Button>}
    {getUserId() === product.uid && <Row>
      <Button as={Link} to={`/products/${pid}/edit`}>수정</Button>
      <Button type="button" disabled={pending} onClick={remove}>{pending ? '삭제 중...' : '삭제'}</Button>
    </Row>}
  </ProductLayout>
}

export default Product
