import { Loader } from '@mantine/core'
import { Leaf } from '@phosphor-icons/react'
import type { RefObject } from 'react'
import ChatBanner from './ChatBanner'
import MessageBox from './MessageBox'
import type { Message } from './useChatConversation'

interface ChatMessagesListProps {
  messages: Message[]
  isPending: boolean
  bottomRef: RefObject<HTMLDivElement | null>
}

const ChatMessagesList = ({ messages, isPending, bottomRef }: ChatMessagesListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 opacity-90">
        <ChatBanner />
      </div>
    )
  }

  return (
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
  )
}

export default ChatMessagesList
