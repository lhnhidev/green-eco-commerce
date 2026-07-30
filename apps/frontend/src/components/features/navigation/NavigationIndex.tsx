import type * as React from 'react'

type NavigationIndexType = {
  text: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  isActive: boolean
}

const NavigationIndex = ({ text, isActive, icon: Icon }: NavigationIndexType) => {
  return (
    <div
      className={`h-8 px-2 rounded-md transition-colors duration-150 flex items-center gap-2 text-sm ${
        isActive
          ? 'bg-primary text-white font-medium'
          : 'text-muted-foreground hover:cursor-pointer hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon size={16} />
      <span>{text}</span>
    </div>
  )
}

export default NavigationIndex
