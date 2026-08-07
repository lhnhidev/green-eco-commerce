import ChatInputBar from '@components/features/chatbot/ChatInputBar'
import ChatMessagesList from '@components/features/chatbot/ChatMessagesList'
import HeaderChatbot from '@components/features/chatbot/HeaderChatbot'
import { useChatConversation } from '@components/features/chatbot/useChatConversation'
import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Container from '@components/ui/primitives/Container'
import Seo from '@components/ui/Seo'

const EcoAssistantPage = () => {
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

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Eco Assistant', href: '/eco-assistant' },
  ]

  return (
    <Container width="page" className="py-6">
      <Seo title="Eco Assistant - Green Cart" />
      <PageBreadcrumbs items={breadcrumbItems} mb="sm" />

      <div className="flex flex-col rounded-lg bg-white shadow-lg border border-border overflow-hidden h-[calc(100vh-220px)] min-h-[480px]">
        <HeaderChatbot
          variant="page"
          activeSessionId={sessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
        />

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
    </Container>
  )
}

export default EcoAssistantPage
