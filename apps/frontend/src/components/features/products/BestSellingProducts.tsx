import { useGetBestSellingProducts } from '@api'
import Panel from '@components/ui/primitives/Panel'
import { Avatar, Badge, Skeleton, Table, Text } from '@mantine/core'
import { TrophyIcon } from '@phosphor-icons/react'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'

const BestSellingProducts = ({ top = 10 }: { top?: number }) => {
  const { data: products, isLoading } = useGetBestSellingProducts({ top })

  return (
    <Panel variant="admin" padding="md" className="h-full">
      <div className="flex items-center gap-2 mb-3">
        <TrophyIcon className="text-amber-500 text-lg" />
        <h3 className="text-sm font-semibold text-gray-800">Best-Selling Products</h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton key
            <Skeleton key={i} height={40} radius="sm" />
          ))}
        </div>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}>#</Table.Th>
              <Table.Th>Product</Table.Th>
              <Table.Th w={80}>Units Sold</Table.Th>
              <Table.Th w={100}>Revenue</Table.Th>
              <Table.Th w={90}>CO₂ Index</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(products ?? []).length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text size="sm" c="dimmed" ta="center" py="sm">
                    No order data yet.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              (products ?? []).map((p, i) => (
                <Table.Tr key={p.productId}>
                  <Table.Td>
                    <Badge
                      size="sm"
                      variant="light"
                      color={i === 0 ? 'yellow' : i === 1 ? 'gray' : i === 2 ? 'orange' : 'blue'}
                    >
                      {i + 1}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-2">
                      <Avatar src={resolveImageUrl(p.imageUrl)} size="sm" radius="sm" alt={p.name} />
                      <Text size="sm" fw={500} className="line-clamp-1">
                        {p.name}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600} c="green.7">
                      {p.totalUnitsSold}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600}>
                      {formatCurrency(p.totalRevenue)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="xs"
                      variant="dot"
                      color={p.carbonIndex < 2 ? 'green' : p.carbonIndex < 5 ? 'yellow' : 'red'}
                    >
                      {p.carbonIndex.toFixed(1)} kg
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      )}
    </Panel>
  )
}

export default BestSellingProducts
