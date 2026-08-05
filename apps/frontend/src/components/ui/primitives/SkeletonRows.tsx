import { Skeleton } from '@mantine/core'

type SkeletonRowsProps = {
  rows?: number
  cols: number
}

const SkeletonRows = ({ rows = 5, cols }: SkeletonRowsProps) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder, no reordering
      <tr key={rowIndex}>
        {Array.from({ length: cols }).map((_, colIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder, no reordering
          <td key={colIndex} className="px-2 py-1.5">
            <Skeleton height={14} radius="sm" />
          </td>
        ))}
      </tr>
    ))}
  </>
)

export default SkeletonRows
