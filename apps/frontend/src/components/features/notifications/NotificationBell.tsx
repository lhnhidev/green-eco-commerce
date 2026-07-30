import {
  getGetMyNotificationsQueryKey,
  getGetUnreadCountQueryKey,
  useGetMyNotifications,
  useGetUnreadCount,
  useMarkAllRead,
  useMarkRead,
} from '@api'
import type { NotificationDto } from '@api/schemas'
import { ActionIcon, Indicator, Menu, ScrollArea, Text } from '@mantine/core'
import { BellIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const PARAMS = { pageNumber: 1, pageSize: 10 }
const POLL_INTERVAL = 30000

const NotificationBell = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: unreadCount = 0 } = useGetUnreadCount({ query: { refetchInterval: POLL_INTERVAL } })
  const { data } = useGetMyNotifications(PARAMS, { query: { refetchInterval: POLL_INTERVAL } })
  const notificationItems = data?.items ?? []

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetUnreadCountQueryKey() })
    queryClient.invalidateQueries({ queryKey: getGetMyNotificationsQueryKey(PARAMS) })
  }

  const { mutate: markRead } = useMarkRead({ mutation: { onSuccess: invalidate } })
  const { mutate: markAllRead } = useMarkAllRead({ mutation: { onSuccess: invalidate } })

  const handleClick = (notification: NotificationDto) => {
    if (!notification.isRead) markRead({ id: notification.id })
    if (notification.link) navigate(notification.link)
  }

  return (
    <Menu shadow="md" width={320} position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray" aria-label="Notifications">
          <Indicator disabled={unreadCount === 0} label={unreadCount > 9 ? '9+' : unreadCount} size={16} color="red">
            <BellIcon size={18} />
          </Indicator>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <div className="flex items-center justify-between px-3 py-1">
          <Text size="xs" fw={700} c="dimmed" tt="uppercase">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <button type="button" onClick={() => markAllRead()} className="text-xs text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <Menu.Divider />
        <ScrollArea.Autosize mah={320}>
          {notificationItems.length === 0 ? (
            <Menu.Item disabled>No notifications yet</Menu.Item>
          ) : (
            notificationItems.map((n) => (
              <Menu.Item key={n.id} onClick={() => handleClick(n)} className={n.isRead ? undefined : 'bg-green-50/60'}>
                <Text size="xs" fw={600}>
                  {n.title}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {n.message}
                </Text>
                <Text size="10px" c="dimmed" mt={2}>
                  {dayjs(n.createdAt).format('DD MMM, HH:mm')}
                </Text>
              </Menu.Item>
            ))
          )}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  )
}

export default NotificationBell
