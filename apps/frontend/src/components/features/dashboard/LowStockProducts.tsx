import { useGetApiProductsAll } from '@api'
import { Progress } from '@mantine/core'

const LOW_STOCK_WARN = 20

const LowStockProducts = () => {
  const { data, isLoading } = useGetApiProductsAll()

  const rows = [...(data ?? [])]
    .filter((p) => p.isActive)
    .sort((a, b) => a.stockQty - b.stockQty)
    .slice(0, 7)
  return (
    <div className="bg-white border border-[#ececee] rounded-xl shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden h-full">
      <div className="px-3.5 py-2.5 border-b border-[#ececee] flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#18181b]">Lowest stock</span>
        <span className="text-[11px] text-[#a1a1aa]">7 products</span>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-[12px] text-[#a1a1aa]">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="p-6 text-center text-[12px] text-[#a1a1aa]">No products</div>
      ) : (
        <div className="px-3.5 py-2">
          {rows.map((p) => (
            <div key={p.id} className="py-1.5 border-b border-[#f4f4f5] last:border-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[12px] font-medium truncate">{p.name}</span>
                <span
                  className={`text-[11px] font-semibold shrink-0 ${
                    p.stockQty < LOW_STOCK_WARN ? 'text-red-500' : 'text-[#71717a]'
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
