import ChatInputBar from './ChatInputBar'
import ChatMessagesList from './ChatMessagesList'
import HeaderChatbot from './HeaderChatbot'
import { useChatConversation } from './useChatConversation'

const ChatComunication = () => {
  const {
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
  } = useChatConversation()

  return (
    <div className="fixed flex flex-col justify-between bottom-24 right-6 lg:bottom-10 lg:right-10 text-sm rounded-lg bg-white shadow-lg z-50 border border-border w-[380px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100vh-120px)] overflow-hidden">
      <HeaderChatbot activeSessionId={sessionId} onNewChat={handleNewChat} onSelectSession={handleSelectSession} />

      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/50 custom-scrollbar scroll-smooth">
        <ChatMessagesList messages={messages} isPending={isPending} bottomRef={bottomRef} />
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <ChatInputBar
          inputValue={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          isPending={isPending}
        />
      </div>
    </div>
  )
}

export default ChatComunication
