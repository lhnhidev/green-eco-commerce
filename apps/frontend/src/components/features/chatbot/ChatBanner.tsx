import { useAuth } from '@hooks/useAuth'
import { Leaf } from '@phosphor-icons/react'
import { Typewriter } from 'react-simple-typewriter'

const ChatBanner = () => {
  const { user } = useAuth()
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'there' : 'there'

  return (
    <div className="flex justify-center items-center p-6">
      {/* Container chính: Đổi từ inline-block thành flex để icon và chữ nằm hàng ngang đẹp hơn */}
      <div className="shadow-xl flex items-center gap-4 bg-linear-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-3xl max-w-xl border border-white/20 backdrop-blur-md">
        {/* Icon Leaf */}
        <div className="text-3xl animate-pulse bg-white/20 p-2 rounded-full">
          <Leaf weight="fill" color="#fff" />
        </div>

        {/* Khu vực chữ chạy hiệu ứng Typing */}
        <div className="text-lg font-medium min-w-80">
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
