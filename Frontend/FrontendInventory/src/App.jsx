import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import StockManager from './components/StockManager'
import StockReport from './components/StockReport'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/products/new" element={<ProductForm />} />
      <Route path="/products/:id/stock" element={<StockManager />} />
      <Route path="/stock-report/:id" element={<StockReport />} />
    </Routes>
    </>
  )
}

export default App
