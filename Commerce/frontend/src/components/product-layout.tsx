import type { ReactNode } from 'react'
import image from '../assets/product.svg'
import { ProductImage, ProductSplit, Stack } from '../styles'

const ProductLayout = ({ name, children }: { name: string; children: ReactNode }) => (
  <ProductSplit>
    <ProductImage src={image} alt={`${name} 예시 이미지`} />
    <Stack>{children}</Stack>
  </ProductSplit>
)

export default ProductLayout
