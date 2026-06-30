import { TextInput, Tooltip } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import { usePostApiChatbot } from '../../../api'
import ChatBanner from './ChatBanner'
import HeaderChatbot from './HeaderChatbot'
import MessageBox from './MessageBox'

type Message = {
  id: number
  message: string
  time: string
  isBot: boolean
}

// const mockMessages: Message[] = [
//   {
//     id: 1,
//     message: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
//     time: '10:00',
//     isBot: true,
//   },
//   {
//     id: 2,
//     message: 'Tôi muốn tìm sản phẩm thân thiện với môi trường.',
//     time: '10:01',
//     isBot: false,
//   },
//   {
//     id: 3,
//     message:
//       'Tuyệt vời! Chúng tôi có rất nhiều sản phẩm xanh:\n1. Túi vải tái chế\n2. Bình nước inox\n3. Ống hút tre\n4. Xà phòng hữu cơ\n5. Bàn chải tre\n6. Hộp đựng thức ăn thủy tinh\n7. Dầu gội khô\n8. Nến từ sáp đậu nành\n9. Khăn giấy tái chế\n10. Túi ziplock silicon\n11. Bọc thức ăn bằng sáp ong',
//     time: '10:01',
//     isBot: true,
//   },
//   {
//     id: 4,
//     message:
//       'Tuyệt vời! Chúng tôi có rất nhiều sản phẩm xanh:\n1. Túi vải tái chế\n2. Bình nước inox\n3. Ống hút tre\n4. Xà phòng hữu cơ\n5. Bàn chải tre\n6. Hộp đựng thức ăn thủy tinh\n7. Dầu gội khô\n8. Nến từ sáp đậu nành\n9. Khăn giấy tái chế\n10. Túi ziplock silicon\n11. Bọc thức ăn bằng sáp ong',
//     time: '10:01',
//     isBot: true,
//   },
// ]

const formatTime = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

const ChatComunication = () => {
  const [messages, setMessages] = useState<Message[]>([])

  const [inputValue, setInputValue] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { mutate: askChatbot, isPending } = usePostApiChatbot()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
        data: { idSectionMessage: null, prompt: trimmed },
      },
      {
        onSuccess: (response) => {
          const botMessage: Message = {
            id: Date.now() + 1,
            message: response,
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
    <div className="fixed flex flex-col justify-between bottom-10 right-10 text-sm rounded-2xl bg-white shadow-2xl z-50 px-3 py-4 border border-gray-300 min-h-125 min-w-96">
      <div className="max-h-150 overflow-auto">
        <HeaderChatbot />
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
                  Đang trả lời
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
