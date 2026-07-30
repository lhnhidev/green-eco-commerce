import { useAuth } from '@hooks/useAuth'
import { Leaf } from '@phosphor-icons/react'
import { Typewriter } from 'react-simple-typewriter'

const ChatBanner = () => {
  const { user } = useAuth()
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'there' : 'there'

  return (
    <div className="flex justify-center items-center p-6">
      {/* Container chính: Đổi từ inline-block thành flex để icon và chữ nằm hàng ngang đẹp hơn */}
      <div className="shadow-sm flex items-center gap-3 bg-primary text-white py-3 px-5 rounded-lg max-w-xl">
        {/* Icon Leaf */}
        <div className="text-2xl animate-pulse bg-white/20 p-2 rounded-full shrink-0">
          <Leaf weight="fill" color="#fff" />
        </div>

        {/* Khu vực chữ chạy hiệu ứng Typing */}
        <div className="text-sm font-medium min-w-64">
          <Typewriter
            words={[`Hi ${fullName}!`, 'How can I help you live greener today?']}
            loop={0} // Số 0 nghĩa là lặp lại vô hạn (infinite)
            cursor
            cursorStyle="|"
            typeSpeed={60} // Tốc độ gõ (ms)
            deleteSpeed={40} // Tốc độ xóa chữ (ms)
            delaySpeed={2500} // Thời gian dừng lại sau khi gõ xong 1 câu
          />
        </div>
      </div>
    </div>
  )
}

export default ChatBanner
