import { Link, useParams } from 'react-router-dom'
import ProductLayout from '../components/product-layout'
import { money, products } from '../data'
import { Button, Description, Muted } from '../styles'

const Product = () => {
  const { pid } = useParams()
  const product = products.find((item) => item.pid === pid)
  if (!product) return <p>상품을 찾을 수 없습니다.</p>

  return (
    <ProductLayout name={product.pname}>
      <Muted>상품 상세</Muted>
      <h1>{product.pname}</h1>
      <h2>{money(product.price)}원</h2>
      <Description>{product.content}</Description>
      <Button as={Link} to={`/products/${pid}/checkout`}>구매하기</Button>
    </ProductLayout>
  )
}

export default Product
