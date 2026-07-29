import { getGetAllChatSessionsQueryKey, useAskChatbot, useGetChatSessionMessages } from '@api'
import { ChatRole } from '@api/schemas'
import { TextInput, Tooltip } from '@mantine/core'
import { PaperPlaneTiltIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import ChatBanner from './ChatBanner'
import HeaderChatbot from './HeaderChatbot'
import MessageBox from './MessageBox'

type Message = {
  id: number
  message: string
  time: string
  isBot: boolean
}

const SESSION_STORAGE_KEY = 'chatbotSessionId'

const formatTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

const ChatComunication = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(() =>
    typeof localStorage === 'undefined' ? null : localStorage.getItem(SESSION_STORAGE_KEY),
  )

  const [inputValue, setInputValue] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { mutate: askChatbot, isPending } = useAskChatbot()

  const { data: history, isError: historyError } = useGetChatSessionMessages(sessionId ?? '', {
    query: { enabled: !!sessionId },
  })

  // Hydrate a previously-started conversation once its history loads.
  useEffect(() => {
    if (history) {
      setMessages(
        history.map((m, i) => ({
          id: i,
          message: m.content,
          time: '',
          isBot: m.role === ChatRole.Bot,
        })),
      )
    }
  }, [history])

  // Session was deleted or belongs to someone else (e.g. after logging in as a different user) — start fresh.
  useEffect(() => {
    if (historyError) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      setSessionId(null)
      setMessages([])
    }
  }, [historyError])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNewChat = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setSessionId(null)
    setMessages([])
  }

  const handleSelectSession = (id: string) => {
    if (id === sessionId) return
    setMessages([])
    setSessionId(id)
    localStorage.setItem(SESSION_STORAGE_KEY, id)
  }

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isPending) return

    const userMessage: Message = {
      id: Date.now(),
      message: trimmed,
      time: formatTime(),
      isBot: false,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    askChatbot(
      {
        data: { idSectionMessage: sessionId, prompt: trimmed },
      },
      {
        onSuccess: (response) => {
          if (response.sessionId !== sessionId) {
            setSessionId(response.sessionId)
            localStorage.setItem(SESSION_STORAGE_KEY, response.sessionId)
            queryClient.invalidateQueries({ queryKey: getGetAllChatSessionsQueryKey() })
          }
          const botMessage: Message = {
            id: Date.now() + 1,
            message: response.message,
            time: formatTime(),
            isBot: true,
          }
          setMessages((prev) => [...prev, botMessage])
        },
        onError: () => {
          const errorMessage: Message = {
            id: Date.now() + 1,
            message: 'Please try again!',
            time: formatTime(),
            isBot: true,
          }
          setMessages((prev) => [...prev, errorMessage])
        },
      },
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="fixed flex flex-col justify-between bottom-24 right-6 lg:bottom-10 lg:right-10 text-sm rounded-2xl bg-white shadow-2xl z-50 px-3 py-4 border border-gray-300 min-h-125 min-w-96">
      <div className="max-h-150 overflow-auto">
        <HeaderChatbot activeSessionId={sessionId} onNewChat={handleNewChat} onSelectSession={handleSelectSession} />
        <div className="mt-6">
          <ChatBanner />
        </div>

        <div className="flex-1 mt-4 px-1">
          <div className="flex flex-col gap-3 py-2">
            {messages.map((msg) => (
              <MessageBox key={msg.id} message={msg.message} time={msg.time} isBot={msg.isBot} />
            ))}

            {/* Typing indicator khi đang chờ bot trả lời */}
            {isPending && (
              <div className="flex items-end gap-2">
                <span className="text-lg">🤖</span>
                <div
                  className="px-4 py-2 rounded-lg rounded-bl-sm text-xs text-gray-400"
                  style={{ backgroundColor: '#f1f3f5' }}
                >
                  Typing
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}

            {/* Anchor để scroll xuống */}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      <div className="px-4">
        <TextInput
          classNames={{ input: '!py-7 !px-5' }}
          placeholder="Enter your question here"
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          rightSection={
            <Tooltip label="Send">
              {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
              {/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
              <div
                className={`p-5 mr-5 transition-all ${
                  isPending || !inputValue.trim()
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'cursor-pointer hover:text-primary'
                }`}
                onClick={handleSend}
              >
                <PaperPlaneTiltIcon weight="fill" />
              </div>
            </Tooltip>
          }
        />
      </div>
    </div>
  )
}

export default ChatComunication
