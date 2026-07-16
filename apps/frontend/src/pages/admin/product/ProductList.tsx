import { useGetApiProductsAll } from '@api'
import { ActionIcon, Badge, Button, Table, TextInput } from '@mantine/core'
import { useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router'

const ProductList = () => {
  const [search, setSearch] = useState('')
  const { data: products, isLoading } = useGetApiProductsAll()

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
  }, [products, search])

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2.5 mb-2.5">
        <TextInput
          placeholder="Search products..."
          size="xs"
          leftSection={<FiSearch size={13} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={220}
        />
        <span className="text-[11px] text-[#71717a]">
          {filteredProducts.length} of {products?.length ?? 0} shown
        </span>
        <div className="flex-1" />
        <Button
          component={Link}
          to="/admin/product/create"
          color="primary"
          size="xs"
          leftSection={<FiPlus size={13} />}
        >
          Add new product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
        <Table
          verticalSpacing={6}
          horizontalSpacing={8}
          highlightOnHover
          classNames={{
            th: '!text-[11px] !font-semibold !uppercase !tracking-[0.04em] !text-[#71717a] !bg-[#fafafa]',
            td: '!text-[12px]',
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product name</Table.Th>
              <Table.Th w={90}>Price</Table.Th>
              <Table.Th w={70}>Stock</Table.Th>
              <Table.Th w={150}>Materials</Table.Th>
              <Table.Th w={95}>Carbon index</Table.Th>
              <Table.Th w={90}>Recycle</Table.Th>
              <Table.Th w={80}>Status</Table.Th>
              <Table.Th w={70} ta="right">
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">Loading products…</div>
                </Table.Td>
              </Table.Tr>
            ) : filteredProducts.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">No products found.</div>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredProducts.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td className="!font-medium">{p.name}</Table.Td>
                  <Table.Td>${p.price?.toFixed(2)}</Table.Td>
                  <Table.Td>
                    <span className={p.stockQty < 20 ? 'text-red-500 font-semibold' : ''}>{p.stockQty}</span>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex gap-1 flex-nowrap items-center overflow-hidden">
                      {p.materials?.slice(0, 1).map((m) => (
                        <Badge key={m.id} size="xs" variant="light" color="primary" radius="xl">
                          {m.name}
                        </Badge>
                      ))}
                      {(p.materials?.length ?? 0) > 1 && (
                        <span className="text-[11px] text-[#a1a1aa] shrink-0">+{p.materials.length - 1}</span>
                      )}
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <span className="text-[#71717a]">
                      {p.carbonIndex} <span className="text-[#a1a1aa]">/ {p.baselineCarbonIndex}</span>
                    </span>
                  </Table.Td>
                  <Table.Td className="!text-[#71717a]">{p.recyclePercent}%</Table.Td>
                  <Table.Td>
                    <Badge size="xs" variant="light" color={p.isActive ? 'primary' : 'gray'} radius="xl">
                      {p.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Td>
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

export default ProductList
