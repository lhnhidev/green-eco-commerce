import { RiRobot3Line } from 'react-icons/ri'
import { Typewriter } from 'react-simple-typewriter'
import { useAppSelector } from '../../../hooks/useAppSelector'

const ChatBanner = () => {
  const fullName = useAppSelector((state) => {
    if (state.auth.user?.firstName === undefined || state.auth.user?.lastName === undefined) return 'bạn'

    return `${state.auth.user?.firstName || ''} ${state.auth.user?.lastName || ''}`.trim() || 'bạn'
  })

  return (
    <div className="flex justify-center items-center p-6">
      {/* Container chính: Đổi từ inline-block thành flex để icon và chữ nằm hàng ngang đẹp hơn */}
      <div className="shadow-xl flex items-center gap-4 bg-primary text-white py-4 px-6 rounded-full max-w-xl">
        {/* Icon Robot */}
        <div className="text-3xl animate-bounce">
          <RiRobot3Line />
        </div>

        {/* Khu vực chữ chạy hiệu ứng Typing */}
        <div className="text-lg font-medium min-w-80">
          <Typewriter
            words={[`Chào ${fullName}!`, 'Hôm nay tôi có thể giúp gì cho bạn?']}
            loop={0} // Số 0 nghĩa là lặp lại vô hạn (infinite)
            cursor
            cursorStyle="_"
            typeSpeed={80} // Tốc độ gõ (ms)
            deleteSpeed={50} // Tốc độ xóa chữ (ms)
            delaySpeed={2000} // Thời gian dừng lại sau khi gõ xong 1 câu (2 giây)
          />
        </div>
      </div>
    </div>
  )
}

export default ChatBanner
