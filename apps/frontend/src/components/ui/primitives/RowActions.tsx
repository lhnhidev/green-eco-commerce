import { ActionIcon, Tooltip } from '@mantine/core'
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type RowActionsProps = {
  onEdit?: () => void
  onDelete?: () => void
  extra?: ReactNode
}

const RowActions = ({ onEdit, onDelete, extra }: RowActionsProps) => (
  <div className="flex items-center justify-end gap-1">
    {extra}
    {onEdit && (
      <Tooltip label="Edit">
        <ActionIcon variant="subtle" size="sm" onClick={onEdit} aria-label="Edit">
          <PencilSimpleIcon size={14} />
        </ActionIcon>
      </Tooltip>
    )}
    {onDelete && (
      <Tooltip label="Delete">
        <ActionIcon variant="subtle" color="red" size="sm" onClick={onDelete} aria-label="Delete">
          <TrashIcon size={14} />
        </ActionIcon>
      </Tooltip>
    )}
  </div>
)

export default RowActions
