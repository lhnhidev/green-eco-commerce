import { useGetAllCategories, useGetAllProducts } from '@api'
import { ActionIcon, Button, Table, TextInput } from '@mantine/core'
import { useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router'

const CategoryList = () => {
  const [search, setSearch] = useState('')
  const { data: categories, isLoading } = useGetAllCategories()
  const { data: productsPage } = useGetAllProducts()
  const products = productsPage?.items ?? []

  // Count products per category
  const productCount = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1)
    }
    return map
  }, [products])

  // Map id -> name for parent category display
  const nameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of categories ?? []) map.set(c.id, c.name)
    return map
  }, [categories])

  // Sort: parents first, children immediately after their parent
  const sortedCategories = useMemo(() => {
    if (!categories) return []
    const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    if (search) return filtered

    const roots = categories.filter((c) => !c.parentId)
    const result: typeof categories = []
    for (const root of roots) {
      result.push(root)
      result.push(...categories.filter((c) => c.parentId === root.id))
    }
    // Orphaned children (data error) still shown
    for (const c of categories) {
      if (!result.includes(c)) result.push(c)
    }
    return result
  }, [categories, search])

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2.5 mb-2.5">
        <TextInput
          placeholder="Search categories..."
          size="xs"
          leftSection={<FiSearch size={13} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={220}
        />
        <span className="text-[11px] text-muted-foreground">
          {sortedCategories.length} of {categories?.length ?? 0} shown
        </span>
        <div className="flex-1" />
        <Button
          component={Link}
          to="/admin/category/create"
          color="primary"
          size="xs"
          leftSection={<FiPlus size={13} />}
        >
          Add new category
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
        <Table
          verticalSpacing={6}
          horizontalSpacing={8}
          highlightOnHover
          classNames={{
            th: '!text-[11px] !font-semibold !uppercase !tracking-[0.04em] !text-muted-foreground !bg-[#fafafa]',
            td: '!text-[12px]',
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={220}>Category name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th w={160}>Parent</Table.Th>
              <Table.Th w={90} ta="right">
                Products
              </Table.Th>
              <Table.Th w={70} ta="right">
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">Loading categories…</div>
                </Table.Td>
              </Table.Tr>
            ) : sortedCategories.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">No categories found.</div>
                </Table.Td>
              </Table.Tr>
            ) : (
              sortedCategories.map((cat) => (
                <Table.Tr key={cat.id}>
                  <Table.Td className="!font-medium">
                    {cat.parentId && <span className="text-[#d4d4d8] mr-1.5">└</span>}
                    {cat.name}
                  </Table.Td>
                  <Table.Td className="!text-muted-foreground">{cat.description || '—'}</Table.Td>
                  <Table.Td className="!text-muted-foreground">
                    {cat.parentId ? (nameById.get(cat.parentId) ?? '—') : <span className="text-[#d4d4d8]">—</span>}
                  </Table.Td>
                  <Table.Td ta="right">{productCount.get(cat.id) ?? 0}</Table.Td>
                  <Table.Td>
                    <div className="flex gap-0.5 justify-end">
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <FiEdit2 size={13} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red" size="sm">
                        <FiTrash2 size={13} />
                      </ActionIcon>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}

export default CategoryList
