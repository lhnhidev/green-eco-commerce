import { useGetAllCategories } from '@api'
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
          <Skeleton key={i} height={120} radius="xl" />
        ))}
      </div>
    )
  }

  if (topCategories.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {topCategories.map((category, i) => {
        const CategoryIcon = ICON_CYCLE[i % ICON_CYCLE.length]
        return (
          <Link
            key={category.id}
            to={`/products?categoryId=${category.id}`}
            className="group flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-green-200 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <CategoryIcon size={22} weight="fill" className="text-primary" />
            </div>
            <span className="font-semibold text-sm text-gray-800 line-clamp-1">{category.name}</span>
            <span className="text-xs text-gray-400">{category.productCount} products</span>
          </Link>
        )
      })}
    </div>
  )
}

export default CategoryTiles
