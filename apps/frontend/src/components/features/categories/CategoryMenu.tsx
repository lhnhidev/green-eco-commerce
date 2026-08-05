import { useGetAllCategories } from '@api'
import { Menu, UnstyledButton } from '@mantine/core'
import { CaretDownIcon, LeafIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { buildCategoryTree } from '@utils/buildCategoryTree'
import { useMemo } from 'react'
import { Link } from 'react-router'

const CategoryMenu = () => {
  const { data: categoriesData } = useGetAllCategories()

  const rootCategories = useMemo(() => {
    if (!categoriesData) return []
    return buildCategoryTree(categoriesData).sort((a, b) => b.productCount - a.productCount)
  }, [categoriesData])

  if (rootCategories.length === 0) return null

  // Split into up to 3 columns of top-level categories; a 4th column is a static promo tile.
  const columns: (typeof rootCategories)[] = [[], [], []]
  rootCategories.forEach((category, index) => {
    columns[index % 3].push(category)
  })

  return (
    <Menu
      shadow="lg"
      width={820}
      position="bottom-start"
      offset={8}
      trigger="click-hover"
      openDelay={80}
      closeDelay={120}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className="px-3 py-1.5 rounded-full text-sm font-semibold text-gray-600 hover:text-primary hover:bg-green-50 transition-all duration-150 flex items-center gap-1">
          <SquaresFourIcon size={15} />
          Shop
          <CaretDownIcon size={11} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <div className="grid grid-cols-4 gap-6 p-6 max-h-[420px] overflow-y-auto">
          {columns.map((column, colIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed 3-column layout, not reorderable
            <div key={colIndex} className="flex flex-col gap-1 min-w-0">
              {column.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?categoryId=${category.id}`}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-green-50 hover:text-primary transition-colors truncate"
                >
                  <span className="truncate">{category.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{category.productCount}</span>
                </Link>
              ))}
            </div>
          ))}
          <Link
            to="/products"
            className="plant-gradient rounded-lg aspect-[4/5] flex flex-col items-center justify-center gap-2 p-4 text-center hover:opacity-90 transition-opacity"
          >
            <LeafIcon size={28} className="text-primary" weight="fill" />
            <span className="text-sm font-semibold text-primary">Browse all products</span>
          </Link>
        </div>
      </Menu.Dropdown>
    </Menu>
  )
}

export default CategoryMenu
