import { useState } from 'react'
import { useGetApiProductsSome } from '../../../api'
import ProductCard from './ProductCard'

const ProductList = () => {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(4)

  const { data: products } = useGetApiProductsSome({
    PageNumber: pageNumber,
    PageSize: pageSize,
  })

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList
