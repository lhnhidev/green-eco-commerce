type NavigationIndexType = {
  text: string
  icon: React.ComponentType
  isActive: boolean
}

const NavigationIndex = ({ text, isActive, icon: Icon }: NavigationIndexType) => {
  return (
    <div
      className={`px-5 py-3 rounded-xl ${isActive ? 'bg-primary text-white' : 'text-(--color-foreground) hover:cursor-pointer hover:bg-[#e9e9e9]'} flex gap-5`}
    >
      <Icon /> {text}
    </div>
  )
}

export default NavigationIndex
