import { getGetAllProductsQueryKey, useCreateProduct } from '@api'
import ProductForm, { type ProductFormValues } from '@components/features/products/ProductForm'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

const ProductCreate = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createProduct, isPending } = useCreateProduct({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetAllProductsQueryKey() })
      },
    },
  })

  const handleSubmit = (values: ProductFormValues) => {
    createProduct(
      {
        data: {
          name: values.name,
          description: values.description || null,
          price: values.price,
          stockQty: values.stockQty,
          categoryId: values.categoryId,
          carbonIndex: values.carbonIndex,
          baselineCarbonIndex: values.baselineCarbonIndex,
          decomposePercent: values.decomposePercent,
          recyclePercent: values.recyclePercent,
          imageUrl: values.imageUrl,
          materialIds: values.materialIds,
        },
      },
      {
        onSuccess: () => {
          notifications.show({ title: 'Success', message: 'Product created', color: 'green' })
          navigate('/admin/product')
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Could not create product', color: 'red' })
        },
      },
    )
  }

  return <ProductForm editingProduct={null} onSubmit={handleSubmit} isSubmitting={isPending} />
}

export default ProductCreate
