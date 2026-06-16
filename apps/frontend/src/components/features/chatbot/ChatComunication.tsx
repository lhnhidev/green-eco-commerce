import { TextInput } from '@mantine/core'
import ChatBanner from './ChatBanner'
import HeaderChatbot from './HeaderChatbot'

const ChatComunication = () => {
  return (
    <div className="fixed flex flex-col justify-between bottom-10 right-10 text-sm rounded-2xl bg-white shadow-2xl z-50 px-3 py-4 border border-gray-300 min-h-125 min-w-96">
      <div>
        <HeaderChatbot />
        <div className="mt-6">
          <ChatBanner />
        </div>
      </div>

      <div className="px-4">
        <TextInput />
      </div>
    </div>
  )
}

export default ChatComunication
