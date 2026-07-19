import { useGetAllProducts } from '@api'
import { ActionIcon, Badge, Button, Pagination, Table, TextInput } from '@mantine/core'
import { useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router'

const PAGE_SIZE = 20

const ProductList = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetAllProducts({
    PageNumber: page,
    PageSize: PAGE_SIZE,
    Search: search || undefined,
  })

  const products = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2.5 mb-2.5">
        <TextInput
          placeholder="Search products..."
          size="xs"
          leftSection={<FiSearch size={13} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
            setPage(1)
          }}
          w={220}
        />
        <span className="text-[11px] text-muted-foreground">{totalCount} products total</span>
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
            th: '!text-[11px] !font-semibold !uppercase !tracking-[0.04em] !text-muted-foreground !bg-[#fafafa]',
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
            ) : products.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">No products found.</div>
                </Table.Td>
              </Table.Tr>
            ) : (
              products.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td className="font-medium!">{p.name}</Table.Td>
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
                    <span className="text-muted-foreground">
                      {p.carbonIndex} <span className="text-[#a1a1aa]">/ {p.baselineCarbonIndex}</span>
                    </span>
                  </Table.Td>
                  <Table.Td className="text-muted-foreground!">{p.recyclePercent}%</Table.Td>
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

      {totalPages > 1 && (
        <div className="flex justify-end mt-3">
          <Pagination total={totalPages} value={page} onChange={setPage} size="xs" />
        </div>
      )}
    </div>
  )
}

export default ProductList
