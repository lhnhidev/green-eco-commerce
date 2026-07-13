type NavigationIndexType = {
  text: string
  icon: React.ComponentType
  isActive: boolean
}

const NavigationIndex = ({ text, isActive, icon: Icon }: NavigationIndexType) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${isActive ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:cursor-pointer hover:bg-secondary/50 hover:text-foreground'}`}
    >
      <Icon className="text-xl" /> <span className="font-medium">{text}</span>
    </div>
  )
}

export default NavigationIndex
