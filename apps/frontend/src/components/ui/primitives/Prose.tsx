import type { ReactNode } from 'react'

type ProseProps = {
  children: ReactNode
  /** `sm` (product description, default) or `md` (static pages). */
  size?: 'sm' | 'md'
  className?: string
}

// Explicit type-scale replacement for the (inert — @tailwindcss/typography isn't installed) `prose` classes.
const sizeClasses: Record<NonNullable<ProseProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
}

const Prose = ({ children, size = 'sm', className }: ProseProps) => (
  <div
    className={`${sizeClasses[size]} text-gray-600 leading-relaxed whitespace-pre-line
      [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:mt-6 [&_h2]:mb-2
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-2
      [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
      [&_li]:mb-1 [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold [&_strong]:text-gray-800
      ${className ?? ''}`}
  >
    {children}
  </div>
)

export default Prose
