import { invalidateGetAllChatSessions, useAskChatbot, useGetChatSessionMessages } from '@api'
import { ChatRole } from '@api/schemas'
import { useQueryClient } from '@tanstack/react-query'
import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'

export type Message = {
  id: number
  message: string
  time: string
  isBot: boolean
}

const SESSION_STORAGE_KEY = 'chatbotSessionId'

const formatTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

export const useChatConversation = () => {
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
            invalidateGetAllChatSessions(queryClient)
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

  return {
    messages,
    sessionId,
    inputValue,
    setInputValue,
    isPending,
    bottomRef,
    handleNewChat,
    handleSelectSession,
    handleSend,
    handleKeyDown,
  }
}
