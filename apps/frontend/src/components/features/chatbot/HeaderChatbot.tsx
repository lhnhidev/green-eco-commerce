/** biome-ignore-all lint/a11y/useButtonType: <> */

import { getGetAllChatSessionsQueryKey, useDeleteChatSession, useGetAllChatSessions } from '@api'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { ActionIcon, Menu, ScrollArea, Text, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ArrowsInSimpleIcon, ClockCounterClockwiseIcon, TrashIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { BiMessageRoundedAdd } from 'react-icons/bi'
import { setIsShow } from './chatbot.slice'

interface HeaderChatbotProps {
  activeSessionId: string | null
  onNewChat: () => void
  onSelectSession: (id: string) => void
}

const HeaderChatbot = ({ activeSessionId, onNewChat, onSelectSession }: HeaderChatbotProps) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { data: sessions = [] } = useGetAllChatSessions()

  const { mutate: deleteSession } = useDeleteChatSession({
    mutation: {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: getGetAllChatSessionsQueryKey() })
        if (variables.id === activeSessionId) onNewChat()
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not delete conversation.', color: 'red' }),
    },
  })

  return (
    <header className="flex justify-between items-center">
      <span className="font-semibold text-gray-700">Eco Assistant</span>

      <div className="flex items-center gap-2">
        <Menu shadow="md" width={260} position="bottom-end">
          <Menu.Target>
            <Tooltip label="Chat history">
              <button className="cursor-pointer hover:bg-gray-200 transition-all rounded-full p-0.5">
                <ClockCounterClockwiseIcon />
              </button>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <ScrollArea.Autosize mah={260}>
              {sessions.length === 0 ? (
                <Menu.Item disabled>No previous conversations</Menu.Item>
              ) : (
                sessions.map((session) => (
                  <Menu.Item
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={session.id === activeSessionId ? 'bg-gray-100' : undefined}
                    rightSection={
                      <ActionIcon
                        component="span"
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession({ id: session.id })
                        }}
                      >
                        <TrashIcon size={12} />
                      </ActionIcon>
                    }
                  >
                    <Text size="xs" fw={600} truncate>
                      {session.title}
                    </Text>
                    <Text size="10px" c="dimmed">
                      {dayjs(session.createdAt).format('DD MMM, HH:mm')}
                    </Text>
                  </Menu.Item>
                ))
              )}
            </ScrollArea.Autosize>
          </Menu.Dropdown>
        </Menu>

        <Tooltip label="New chat">
          <button onClick={onNewChat} className="cursor-pointer hover:bg-gray-200 transition-all rounded-full p-0.5">
            <BiMessageRoundedAdd />
          </button>
        </Tooltip>

        <Tooltip label="Hiden chatbot">
          <button
            onClick={(e) => {
              e.stopPropagation()
              dispatch(setIsShow(false))
            }}
            className="cursor-pointer hover:bg-gray-200 transition-all rounded-full p-0.5"
          >
            <ArrowsInSimpleIcon />
          </button>
        </Tooltip>
      </div>
    </header>
  )
}

export default HeaderChatbot
