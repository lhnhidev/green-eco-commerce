type NavigationIndexType = {
  text: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  isActive: boolean
}

const NavigationIndex = ({ text, isActive, icon: Icon }: NavigationIndexType) => {
  return (
    <div
      className={`px-2.5 py-1.5 rounded-lg transition-colors duration-150 flex items-center gap-2 text-[13px] ${
        isActive
          ? 'bg-primary text-white font-medium'
          : 'text-muted-foreground hover:cursor-pointer hover:bg-[#f4f4f5] hover:text-[#18181b]'
      }`}
    >
      <Icon size={15} />
      <span>{text}</span>
    </div>
  )
}

export default NavigationIndex
