import { useGetAllProducts } from '@api'
import { useState } from 'react'
import ProductCard from './ProductCardv1'

const ProductList = () => {
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(4)

  const { data: products } = useGetAllProducts({ PageNumber: pageNumber, PageSize: pageSize })

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.items?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList
