import { useGetAllProducts } from '@api'
import { Progress } from '@mantine/core'

const LOW_STOCK_WARN = 20

const LowStockProducts = () => {
  const { data, isLoading } = useGetAllProducts()

  const rows = [...(data?.items ?? [])]
    .filter((p) => p.isActive)
    .sort((a, b) => a.stockQty - b.stockQty)
    .slice(0, 7)
  return (
    <div className="bg-white border border-border rounded-xl shadow-2xs overflow-hidden h-full">
      <div className="px-3.5 py-2.5 border-b border-border flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Lowest stock</span>
        <span className="text-2xs text-fg-subtle">7 products</span>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-xs text-fg-subtle">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="p-6 text-center text-xs text-fg-subtle">No products</div>
      ) : (
        <div className="px-3.5 py-2">
          {rows.map((p) => (
            <div key={p.id} className="py-1.5 border-b border-border last:border-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium truncate">{p.name}</span>
                <span
                  className={`text-2xs font-semibold shrink-0 ${
                    p.stockQty < LOW_STOCK_WARN ? 'text-red-500' : 'text-muted-foreground'
                  }`}
                >
                  {p.stockQty}
                </span>
              </div>
              <Progress
                value={Math.min((p.stockQty / 100) * 100, 100)}
                size={5}
                radius="xl"
                color={p.stockQty < LOW_STOCK_WARN ? 'red' : 'primary'}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LowStockProducts
