import { useState } from 'react'
import ProductCard from '../components/product-card'
import { products } from '../data'
import { Muted, ProductList, Row, Stack, Views } from '../styles'

const Products = () => {
  const [list, setList] = useState(false)

  return (
    <Stack>
      <Row>
        <div><h1>상품 목록</h1><Muted>총 {products.length}개</Muted></div>
        <Views aria-label="상품 보기 방식">
          <button type="button" aria-pressed={!list} onClick={() => setList(false)}>박스형</button>
          <button type="button" aria-pressed={list} onClick={() => setList(true)}>리스트형</button>
        </Views>
      </Row>
      <ProductList $list={list}>
        {products.map((product) => <ProductCard key={product.pid} product={product} list={list} />)}
      </ProductList>
    </Stack>
  )
}

export default Products
