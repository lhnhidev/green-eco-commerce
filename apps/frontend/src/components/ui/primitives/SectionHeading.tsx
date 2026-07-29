import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  icon?: Icon
  children: ReactNode
  /** Spacing/layout classes for the wrapping div — e.g. "mb-4". No default, since it varies by context. */
  className?: string
}

const SectionHeading = ({ icon: IconComponent, children, className }: SectionHeadingProps) => (
  <div className={`flex items-center gap-2 ${className ?? ''}`}>
    {IconComponent && <IconComponent className="text-xl text-primary" />}
    <h2 className="font-bold text-gray-800 text-lg">{children}</h2>
  </div>
)

export default SectionHeading
