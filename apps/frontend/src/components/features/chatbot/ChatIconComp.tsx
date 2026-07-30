import { Plant } from '@phosphor-icons/react'

const ChatIconComp = () => {
  return (
    <div className="fixed bottom-24 lg:bottom-10 right-6 lg:right-10 z-50">
      <div className="relative group cursor-pointer">
        {/* Pulsing ring for dynamic feel */}
        <div className="absolute -inset-1 bg-linear-to-r from-green-400 to-emerald-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        {/* Main button */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-linear-to-br from-green-500 to-emerald-700 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
          <Plant size={28} weight="fill" className="animate-bounce" style={{ animationDuration: '2s' }} />
        </div>
      </div>
    </div>
  )
}

export default ChatIconComp
