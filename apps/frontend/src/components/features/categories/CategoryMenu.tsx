import { useGetAllCategories } from '@api'
import { Menu, UnstyledButton } from '@mantine/core'
import { CaretDownIcon, ListDashesIcon } from '@phosphor-icons/react'
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

  return (
    <Menu shadow="lg" width={220} position="bottom-start" offset={6} trigger="hover" openDelay={50} closeDelay={150}>
      <Menu.Target>
        <UnstyledButton className="px-3.5 py-1.5 rounded-full text-sm font-semibold text-gray-600 hover:text-green-700 hover:bg-green-50 transition-all duration-150 flex items-center gap-1">
          <ListDashesIcon size={15} />
          Categories
          <CaretDownIcon size={11} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {rootCategories.map((category) => (
          <Menu.Item key={category.id} component={Link} to={`/products?categoryId=${category.id}`}>
            {category.name}
            <span className="text-gray-400 ml-1">({category.productCount})</span>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

export default CategoryMenu
