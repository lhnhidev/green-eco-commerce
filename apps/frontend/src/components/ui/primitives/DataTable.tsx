import type { Icon } from '@phosphor-icons/react'
import { TrayIcon } from '@phosphor-icons/react'
import { Pagination, Table } from '@mantine/core'
import type { ReactNode } from 'react'
import EmptyState from './EmptyState'
import Panel from './Panel'
import SkeletonRows from './SkeletonRows'

export type DataTableColumn<T> = {
  key: string
  header: ReactNode
  width?: number
  align?: 'left' | 'right' | 'center'
  render: (row: T) => ReactNode
}

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  isLoading?: boolean
  emptyIcon?: Icon
  emptyTitle?: string
  emptyDescription?: string
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onRowClick?: (row: T) => void
  stickyHeader?: boolean
  /** Rendered as the table panel's header (above the rows) — lets a page's search/filter row read as part of the same card instead of floating above it. */
  toolbar?: ReactNode
}

// Density (verticalSpacing/th/td font sizes) comes from theme.components.Table in main.tsx —
// this component intentionally sets no classNames.
function DataTable<T>({
  columns,
  rows,
  getRowKey,
  isLoading,
  emptyIcon = TrayIcon,
  emptyTitle = 'No records found',
  emptyDescription,
  page,
  totalPages,
  onPageChange,
  onRowClick,
  stickyHeader,
  toolbar,
}: DataTableProps<T>) {
  return (
    <Panel variant="admin" padding="none" className="overflow-hidden">
      {toolbar && <div className="border-b border-border px-3">{toolbar}</div>}
      <div className="overflow-x-auto">
        <Table stickyHeader={stickyHeader}>
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col.key} w={col.width} ta={col.align}>
                  {col.header}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <SkeletonRows cols={columns.length} />
            ) : rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                    size="sm"
                    color="gray"
                  />
                </Table.Td>
              </Table.Tr>
            ) : (
              rows.map((row) => (
                <Table.Tr
                  key={getRowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                >
                  {columns.map((col) => (
                    <Table.Td key={col.key} ta={col.align}>
                      {col.render(row)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>
      {!isLoading && rows.length > 0 && totalPages != null && totalPages > 1 && onPageChange && (
        <div className="flex justify-end p-3 border-t border-border">
          <Pagination total={totalPages} value={page} onChange={onPageChange} />
        </div>
      )}
    </Panel>
  )
}

export default DataTable
