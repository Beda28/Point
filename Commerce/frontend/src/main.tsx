import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/header'
import MyPageLayout from './components/mypage-layout'
import Index from './pages/index'
import Login from './pages/login'
import Signup from './pages/signup'
import Products from './pages/products'
import Product from './pages/product'
import ProductForm from './pages/product-form'
import Checkout from './pages/checkout'
import MyPage from './pages/mypage'
import Payments from './pages/payments'
import Payment from './pages/payment'
import { Page } from './styles'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Header />
    <Page>
      <Routes>
        <Route path="/"                       element={<Index />} />
        <Route path="/login"                  element={<Login />} />
        <Route path="/signup"                 element={<Signup />} />
        <Route path="/products"               element={<Products />} />
        <Route path="/products/new"           element={<ProductForm key="new" />} />
        <Route path="/products/:pid/edit"     element={<ProductForm />} />
        <Route path="/products/:pid"          element={<Product />} />
        <Route path="/products/:pid/checkout" element={<Checkout />} />
        <Route path="/mypage"                 element={<MyPageLayout />}>
          <Route index                        element={<MyPage />} />
          <Route path="products"              element={<Products mine />} />
          <Route path="payments"              element={<Payments key="payments" />} />
          <Route path="payments/:tid"         element={<Payment />} />
          <Route path="sales"                 element={<Payments key="sales" sales />} />
        </Route>
        <Route path="*"                       element={<p>페이지를 찾을 수 없습니다.</p>} />
      </Routes>
    </Page>
  </BrowserRouter>
)
