import { Badge, Button, Card } from '@mantine/core'
import { StarIcon } from '@phosphor-icons/react'
import type { ProductDto } from '../../../api/schemas'
import { ImageWithFallback } from '../../ui/status/ImageWithFallback'

const ProductCard = ({ product }: { product: ProductDto }) => {
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
        <Badge color="green.9" className="absolute top-2 left-2">
          {/* {product.badge} */}
          Air Purifier
        </Badge>

        <div className="absolute inset-0 bg-black/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 hover:bg-(--color-primary)  hover:text-white text-(--color-primary) font-medium px-4 py-2 rounded-full shadow-md transform scale-90 hover:cursor-pointer group-hover:scale-100 transition-all duration-300 text-sm">
            Quick More
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <StarIcon className="h-4 w-4 text-yellow-400" weight="fill" />
          <span className="text-sm font-medium">
            {/* {product.rating} */}
            4.5
          </span>
          <span className="text-sm text-gray-500">
            {/* ({product.reviews}) */}
            67
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">${product.price}</span>
            {/* {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  )} */}
            100
          </div>
          <Button size="xs" radius="xl" color="green.9">
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ProductCard
