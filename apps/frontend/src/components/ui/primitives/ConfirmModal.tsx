import { Button, Group, Modal, type MantineColor, Text } from '@mantine/core'
import type { ReactNode } from 'react'

type ConfirmModalProps = {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: ReactNode
  confirmLabel?: string
  confirmColor?: MantineColor
  loading?: boolean
}

const ConfirmModal = ({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmColor = 'red',
  loading,
}: ConfirmModalProps) => (
  <Modal opened={opened} onClose={onClose} title={title} size="sm">
    <Text size="sm" c="dimmed">
      {message}
    </Text>
    <Group justify="flex-end" gap="xs" mt="lg">
      <Button variant="default" size="xs" onClick={onClose}>
        Cancel
      </Button>
      <Button color={confirmColor} size="xs" loading={loading} onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </Group>
  </Modal>
)

export default ConfirmModal
