import type { OrderStatusEnum } from '@api/schemas/orderStatusEnum'
import { customInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

/**
 * Personal buyer statistics.
 *
 * Shape mirrors the backend `GetMyStatisticsQuery.Response` (camelCase JSON).
 * When the backend is running, `bun orval` regenerates a canonical
 * `useGetMyStatistics` hook in `@api`; this hand-written hook can then be
 * replaced by it. Kept manual so the feature is self-contained meanwhile.
 */
export interface StatisticsSummary {
  /** Total number of orders the user has ever placed (any status). */
  totalOrders: number
  /** Σ(UnitPrice × Quantity) − Discount over non-cancelled orders (primary KPI). */
  totalSpending: number
  /** Portion of totalSpending from non-cancelled orders already paid. */
  paidSpending: number
  /** Portion of totalSpending from non-cancelled orders not yet paid (e.g. COD). paidSpending + pendingSpending = totalSpending. */
  pendingSpending: number
  /** Money paid for orders later cancelled — pending refund. Not part of totalSpending. */
  refundPendingSpending: number
  /** Σ(UnitCo2Saved × Quantity) over non-cancelled orders, in kg. */
  totalCo2Saved: number
  /** Current green-point balance. */
  currentPoints: number
  /** Lifetime earned green points. */
  lifetimePoints: number
}

export interface MonthlyPoint {
  year: number
  month: number
  /** Display label, formatted as `MM/yyyy`. */
  label: string
  amount: number
  co2Saved: number
}

export interface CategorySlice {
  category: string
  amount: number
  quantity: number
}

export interface StatusSlice {
  status: OrderStatusEnum
  count: number
}

export interface MyStatisticsResponse {
  summary: StatisticsSummary
  monthlySpending: MonthlyPoint[]
  categoryBreakdown: CategorySlice[]
  statusBreakdown: StatusSlice[]
}

export const getMyStatistics = (months?: number, signal?: AbortSignal) =>
  customInstance<MyStatisticsResponse>({
    url: '/api/me/statistics',
    method: 'GET',
    params: months !== undefined ? { months } : undefined,
    signal,
  })

export const useMyStatistics = (months = 6) =>
  useQuery({
    queryKey: ['me', 'statistics', months] as const,
    queryFn: ({ signal }) => getMyStatistics(months, signal),
  })