import type { ProductDto } from '@api/schemas'
import { ImageWithFallback } from '@components/ui/status/ImageWithFallback'
import { Badge, Button, Card } from '@mantine/core'
import { LeafIcon } from '@phosphor-icons/react'

const ProductCardv1 = ({ product }: { product: ProductDto }) => {
  const co2Saved = Number(product.baselineCarbonIndex ?? 0) - Number(product.carbonIndex ?? 0)
  const outOfStock = product.stockQty <= 0

  return (
    <Card
      key={product.id}
      shadow="sm"
      padding={0}
      radius="md"
      className="group hover:shadow-lg transition-shadow plant-shadow cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-t-lg group/image">
        <ImageWithFallback
          src={
            product?.imageUrl?.at(0) ||
            'https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=300&h=300&fit=crop'
          }
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.materials?.length > 0 && (
          <Badge color="green.9" className="absolute top-2 left-2">
            {product.materials[0].name}
          </Badge>
        )}
        {outOfStock && (
          <Badge color="gray" className="absolute top-2 right-2">
            Out of stock
          </Badge>
        )}

        <div className="absolute inset-0 bg-black/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 hover:bg-(--color-primary) hover:text-white text-(--color-primary) font-medium px-4 py-2 rounded-full shadow-md transform scale-90 hover:cursor-pointer group-hover:scale-100 transition-all duration-300 text-sm">
            Quick More
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem]">{product.name}</h3>

        <div className="flex items-center gap-1.5 mb-2">
          {co2Saved > 0 ? (
            <>
              <LeafIcon className="h-4 w-4 text-primary" weight="fill" />
              <span className="text-sm font-medium text-primary">{co2Saved.toFixed(2)} kg CO₂ saved</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">{product.recyclePercent}% recyclable</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">${Number(product.price).toFixed(2)}</span>
          <Button size="xs" radius="xl" color="green.9" disabled={outOfStock}>
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ProductCardv1
