/** biome-ignore-all lint/a11y/useButtonType: <> */

import { getGetAllChatSessionsQueryKey, useDeleteChatSession, useGetAllChatSessions } from '@api'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { ActionIcon, Menu, ScrollArea, Text, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ArrowsInSimpleIcon, ClockCounterClockwiseIcon, Leaf, TrashIcon } from '@phosphor-icons/react'
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
    <header className="flex justify-between items-center px-4 py-3 bg-linear-to-r from-green-50 to-emerald-100 rounded-t-2xl border-b border-green-200/50 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-linear-to-br from-green-500 to-emerald-600 p-1.5 rounded-full text-white shadow-sm">
          <Leaf weight="fill" size={16} />
        </div>
        <span className="font-bold text-gray-800 tracking-tight">Eco Assistant</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Menu shadow="lg" width={280} position="bottom-end" radius="md" withArrow>
          <Menu.Target>
            <Tooltip label="Chat history" withArrow>
              <button className="cursor-pointer text-gray-600 hover:text-green-700 hover:bg-green-200/50 transition-all rounded-full p-1.5">
                <ClockCounterClockwiseIcon size={18} weight="bold" />
              </button>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <ScrollArea.Autosize mah={260}>
              {sessions.length === 0 ? (
                <Menu.Item disabled className="text-center py-4 text-gray-500">
                  No previous conversations
                </Menu.Item>
              ) : (
                sessions.map((session) => (
                  <Menu.Item
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`transition-colors ${session.id === activeSessionId ? 'bg-green-50/50 border-l-2 border-green-500' : 'hover:bg-gray-50'}`}
                    rightSection={
                      <ActionIcon
                        component="span"
                        size="sm"
                        variant="subtle"
                        color="red"
                        className="hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession({ id: session.id })
                        }}
                      >
                        <TrashIcon size={14} weight="bold" />
                      </ActionIcon>
                    }
                  >
                    <Text
                      size="sm"
                      fw={session.id === activeSessionId ? 600 : 500}
                      c={session.id === activeSessionId ? 'green.8' : 'dark.7'}
                      truncate
                    >
                      {session.title}
                    </Text>
                    <Text size="10px" c="dimmed" mt={2}>
                      {dayjs(session.createdAt).format('DD MMM, HH:mm')}
                    </Text>
                  </Menu.Item>
                ))
              )}
            </ScrollArea.Autosize>
          </Menu.Dropdown>
        </Menu>

        <Tooltip label="New chat" withArrow>
          <button
            onClick={onNewChat}
            className="cursor-pointer text-gray-600 hover:text-green-700 hover:bg-green-200/50 transition-all rounded-full p-1.5"
          >
            <BiMessageRoundedAdd size={18} />
          </button>
        </Tooltip>

        <Tooltip label="Hide chatbot" withArrow>
          <button
            onClick={(e) => {
              e.stopPropagation()
              dispatch(setIsShow(false))
            }}
            className="cursor-pointer text-gray-600 hover:text-green-700 hover:bg-green-200/50 transition-all rounded-full p-1.5"
          >
            <ArrowsInSimpleIcon size={18} weight="bold" />
          </button>
        </Tooltip>
      </div>
    </header>
  )
}

export default HeaderChatbot
