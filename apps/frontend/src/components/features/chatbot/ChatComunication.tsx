import { TextInput, Tooltip } from '@mantine/core'
import { IoIosSend } from 'react-icons/io'
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
        <TextInput
          classNames={{
            input: '!py-7 !px-5',
          }}
          placeholder="Enter your question here"
          rightSection={
            <Tooltip label="Send">
              <div className="p-5 mr-5 cursor-pointer hover:text-primary transition-all">
                <IoIosSend />
              </div>
            </Tooltip>
          }
        />
      </div>
    </div>
  )
}

export default ChatComunication
