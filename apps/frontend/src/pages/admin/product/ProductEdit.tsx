import { invalidateGetAllProducts, invalidateGetProductById, useGetProductById, useUpdateProduct } from '@api'
import ProductForm, { type ProductFormValues } from '@components/features/products/ProductForm'
import Loading from '@components/ui/status/Loading'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: product, isLoading: isLoadingProduct } = useGetProductById(id!, {
    query: { enabled: !!id },
  })
  const { mutate: updateProduct, isPending } = useUpdateProduct({
    mutation: {
      onSuccess: async () => {
        await invalidateGetAllProducts(queryClient)
        await invalidateGetProductById(queryClient, id!)
      },
    },
  })

  const handleSubmit = (values: ProductFormValues) => {
    if (!id) return
    updateProduct(
      {
        id,
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
          notifications.show({ title: 'Success', message: 'Product updated', color: 'green' })
          navigate('/admin/product')
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Could not update product', color: 'red' })
        },
      },
    )
  }

  if (isLoadingProduct) {
    return <Loading text="Loading product..." />
  }

  return <ProductForm editingProduct={product ?? null} onSubmit={handleSubmit} isSubmitting={isPending} />
}

export default ProductEdit
