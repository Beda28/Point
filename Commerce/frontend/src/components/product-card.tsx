import { Link } from 'react-router-dom'
import { money, products } from '../data'
import image from '../assets/product.svg'
import { ProductImage, ProductItem } from '../styles'

const ProductCard = ({ product, list }: { product: typeof products[number]; list: boolean }) => (
  <ProductItem $list={list}>
    <Link to={`/products/${product.pid}`}>
      <ProductImage src={image} alt={`${product.pname} 예시 이미지`} />
      <div>
        <h2>{product.pname}</h2>
        <p>{money(product.price)}원</p>
      </div>
    </Link>
  </ProductItem>
)

export default ProductCard
