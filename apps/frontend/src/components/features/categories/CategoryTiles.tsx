import { useGetAllCategories } from '@api'
import Panel from '@components/ui/primitives/Panel'
import { Skeleton } from '@mantine/core'
import {
  BasketIcon,
  BathtubIcon,
  BroomIcon,
  type Icon,
  PackageIcon,
  SparkleIcon,
  SprayBottleIcon,
  TShirtIcon,
} from '@phosphor-icons/react'
import { buildCategoryTree } from '@utils/buildCategoryTree'
import { useMemo } from 'react'
import { Link } from 'react-router'

const ICON_CYCLE: Icon[] = [BasketIcon, SparkleIcon, BathtubIcon, TShirtIcon, BroomIcon, SprayBottleIcon, PackageIcon]

const CategoryTiles = ({ limit = 6 }: { limit?: number }) => {
  const { data: categoriesData, isLoading } = useGetAllCategories()

  const topCategories = useMemo(() => {
    if (!categoriesData) return []
    return buildCategoryTree(categoriesData)
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, limit)
  }, [categoriesData, limit])

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
          <Skeleton key={i} radius="lg" className="aspect-square" />
        ))}
      </div>
    )
  }

  if (topCategories.length === 0) return null

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {topCategories.map((category, i) => {
        const CategoryIcon = ICON_CYCLE[i % ICON_CYCLE.length]
        return (
          <Link key={category.id} to={`/products?categoryId=${category.id}`}>
            <Panel
              interactive
              className="aspect-square flex flex-col items-center justify-center gap-2 text-center p-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <CategoryIcon size={18} weight="fill" className="text-primary" />
              </div>
              <span className="font-medium text-xs text-gray-800 line-clamp-1">{category.name}</span>
              <span className="text-2xs text-muted-foreground">{category.productCount} products</span>
            </Panel>
          </Link>
        )
      })}
    </div>
  )
}

export default CategoryTiles
