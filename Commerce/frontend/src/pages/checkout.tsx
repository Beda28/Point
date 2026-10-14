import { useParams } from 'react-router-dom'
import ProductLayout from '../components/product-layout'
import { money, products, user } from '../data'
import { Button, Muted, Summary } from '../styles'

const Checkout = () => {
  const { pid } = useParams()
  const product = products.find((item) => item.pid === pid)
  const pointUsed = 1000
  if (!product) return <p>상품을 찾을 수 없습니다.</p>

  return (
    <ProductLayout name={product.pname}>
      <Muted>상품 결제</Muted>
      <h1>{product.pname}</h1>
      <Summary>
        <div><dt>구매자</dt><dd>{user.id}</dd></div>
        <div><dt>수량</dt><dd>1개</dd></div>
        <div><dt>상품 금액</dt><dd>{money(product.price)}원</dd></div>
        <div><dt>계좌 잔액</dt><dd>{money(user.balance)}원</dd></div>
        <div><dt>보유 포인트</dt><dd>{money(user.points)}P</dd></div>
        <div><dt>사용 포인트</dt><dd>{money(pointUsed)}P</dd></div>
        <div><dt>최종 결제 금액</dt><dd><strong>{money(product.price - pointUsed)}원</strong></dd></div>
      </Summary>
      <Button type="button">결제하기</Button>
    </ProductLayout>
  )
}

export default Checkout
