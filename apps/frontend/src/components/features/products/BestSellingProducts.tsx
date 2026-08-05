import { useGetBestSellingProducts } from '@api'
import Panel from '@components/ui/primitives/Panel'
import { Avatar, Badge, Skeleton, Table, Text } from '@mantine/core'
import { TrophyIcon } from '@phosphor-icons/react'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'

const rankColor = (i: number) => (i === 0 ? 'yellow' : i === 1 ? 'gray' : i === 2 ? 'orange' : 'blue')
const carbonColor = (v: number) => (v < 2 ? 'green' : v < 5 ? 'yellow' : 'red')

type Props = {
  top?: number
  month?: number
  year?: number
}

const BestSellingProducts = ({ top = 10, month, year }: Props) => {
  const { data: products, isLoading } = useGetBestSellingProducts({ top, month, year })

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
      ) : (products ?? []).length === 0 ? (
        <Text size="sm" c="dimmed" ta="center" py="sm">
          No order data yet.
        </Text>
      ) : (
        <>
          {/* Below sm (640px) a table can't fit "Product" + 3 numeric columns without
              truncating the name and CO2 index — switch to a stacked card list instead.
              Desktop/tablet (sm+) keeps the exact table below, untouched. */}
          <div className="flex flex-col gap-2 sm:hidden">
            {(products ?? []).map((p, i) => (
              <div key={p.productId} className="flex gap-3 p-3 border border-border rounded-lg">
                <Avatar src={resolveImageUrl(p.imageUrl)} size="md" radius="sm" alt={p.name} color="primary">
                  {p.name.trim().charAt(0).toUpperCase() || '?'}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1.5">
                    <Badge size="sm" variant="light" color={rankColor(i)}>
                      {i + 1}
                    </Badge>
                    <Text size="sm" fw={500} className="flex-1">
                      {p.name}
                    </Text>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-xs text-fg-subtle">
                      Units <span className="font-semibold text-green-700">{p.totalUnitsSold}</span>
                    </span>
                    <span className="text-xs text-fg-subtle">
                      Revenue <span className="font-semibold text-foreground">{formatCurrency(p.totalRevenue)}</span>
                    </span>
                    <Badge size="xs" variant="dot" color={carbonColor(p.carbonIndex)}>
                      {p.carbonIndex.toFixed(1)} kg
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Table className="hidden sm:table">
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
              {(products ?? []).map((p, i) => (
                <Table.Tr key={p.productId}>
                  <Table.Td>
                    <Badge size="sm" variant="light" color={rankColor(i)}>
                      {i + 1}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-2">
                      <Avatar src={resolveImageUrl(p.imageUrl)} size="sm" radius="sm" alt={p.name} color="primary">
                        {p.name.trim().charAt(0).toUpperCase() || '?'}
                      </Avatar>
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
                    <Badge size="xs" variant="dot" color={carbonColor(p.carbonIndex)}>
                      {p.carbonIndex.toFixed(1)} kg
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Panel>
  )
}

export default BestSellingProducts
