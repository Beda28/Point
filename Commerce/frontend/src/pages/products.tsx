import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/product-card'
import client from '../api/client'
import type { ProductData } from '../api/products'
import { getToken } from '../api/token'
import { Button, Muted, ProductList, Row, Stack, Views } from '../styles'

const Products = ({ mine = false }: { mine?: boolean }) => {
  const [list, setList] = useState(mine)
  const [products, setProducts] = useState<ProductData[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    client.get<ProductData[]>(mine ? '/products/me' : '/products')
      .then(({ data }) => { if (active) setProducts(data) })
      .catch(() => { if (active) setError('상품 목록을 불러오지 못했습니다') })
    return () => { active = false }
  }, [mine])

  if (error) return <p role="alert">{error}</p>
  if (!products) return <p>상품을 불러오는 중입니다.</p>

  return (
    <Stack>
      <Row>
        <div>{mine ? <h2>내가 등록한 상품</h2> : <h1>상품 목록</h1>}<Muted>총 {products.length}개</Muted></div>
        <Row>
          {getToken() && <Button as={Link} to="/products/new">상품 등록</Button>}
          <Views aria-label="상품 보기 방식">
            <button type="button" aria-pressed={!list} onClick={() => setList(false)}>박스형</button>
            <button type="button" aria-pressed={list} onClick={() => setList(true)}>리스트형</button>
          </Views>
        </Row>
      </Row>
      <ProductList $list={list}>
        {products.map((product) => <ProductCard key={product.pid} product={product} list={list} />)}
      </ProductList>
      {!products.length && <Muted>등록된 상품이 없습니다.</Muted>}
    </Stack>
  )
}

export default Products
