import { getGetAllChatSessionsQueryKey, useAskChatbot, useGetChatSessionMessages } from '@api'
import { ChatRole } from '@api/schemas'
import { Loader, TextInput, Tooltip } from '@mantine/core'
import { Leaf, PaperPlaneRight } from '@phosphor-icons/react'
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
  }, [messages, isPending])

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
    <div className="fixed flex flex-col justify-between bottom-24 right-6 lg:bottom-10 lg:right-10 text-sm rounded-lg bg-white shadow-lg z-50 border border-border w-[380px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100vh-120px)] overflow-hidden">
      <HeaderChatbot activeSessionId={sessionId} onNewChat={handleNewChat} onSelectSession={handleSelectSession} />

      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/50 custom-scrollbar scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-90">
            <ChatBanner />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <MessageBox key={msg.id} message={msg.message} time={msg.time} isBot={msg.isBot} />
            ))}

            {/* Typing indicator */}
            {isPending && (
              <div className="flex items-end gap-3 mt-2 animate-pulse">
                <div className="mb-1 shrink-0 bg-linear-to-br from-green-100 to-emerald-200 border-2 border-white shadow-sm rounded-full w-8 h-8 flex items-center justify-center">
                  <Leaf weight="fill" color="#059669" size={16} />
                </div>
                <div className="px-3 py-2 rounded-lg rounded-bl-sm bg-white border border-green-100 text-gray-500 shadow-xs flex gap-1 items-center">
                  <Loader size="xs" color="teal" type="dots" />
                </div>
              </div>
            )}
            <div ref={bottomRef} className="h-1" />
          </div>
        )}
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <TextInput
          classNames={{
            input: 'bg-gray-50 border-gray-200 focus:border-green-400 rounded-md',
          }}
          placeholder="Ask me about eco-friendly living..."
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          rightSection={
            <Tooltip label="Send" withArrow>
              {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
              {/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
              <div
                className={`flex items-center justify-center w-10 h-10 mr-2 rounded-lg transition-all duration-200 ${
                  isPending || !inputValue.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-white cursor-pointer hover:bg-green-600 hover:scale-105 hover:shadow-md'
                }`}
                onClick={handleSend}
              >
                <PaperPlaneRight weight="fill" size={18} />
              </div>
            </Tooltip>
          }
          rightSectionWidth={56}
        />
      </div>
    </div>
  )
}

export default ChatComunication
