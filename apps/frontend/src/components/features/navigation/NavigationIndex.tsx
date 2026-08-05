import type * as React from 'react'

type NavigationIndexType = {
  text: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  isActive: boolean
}

const NavigationIndex = ({ text, isActive, icon: Icon }: NavigationIndexType) => {
  return (
    <div
      className={`relative h-8 pl-2 pr-2 rounded-md transition-colors duration-150 flex items-center gap-2 text-sm ${
        isActive
          ? 'bg-primary/10 text-admin-canopy font-medium'
          : 'text-muted-foreground hover:cursor-pointer hover:bg-admin-mist hover:text-admin-canopy'
      }`}
    >
      {/* Stem-node dot, sits on the vertical rail drawn by the parent's border-l */}
      <span
        className={`absolute -left-[15px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white transition-colors duration-150 ${
          isActive ? 'bg-primary' : 'bg-border-strong'
        }`}
      />
      <Icon size={16} />
      <span>{text}</span>
    </div>
  )
}

export default NavigationIndex
