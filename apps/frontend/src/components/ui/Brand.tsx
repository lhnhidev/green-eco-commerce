import { LeafIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

type BrandType = {
  linkToHome: boolean
  size: 'lg' | 'md' | 'sm'
}

const Brand = ({ linkToHome, size }: BrandType) => {
  const brandStyles = {
    lg: {
      icon: 'h-10 w-10',
      logo: 'h-6 w-6',
      text: 'text-2xl',
    },
    md: {
      icon: 'h-8 w-8',
      logo: 'h-5 w-5',
      text: 'text-xl',
    },
    sm: {
      icon: 'h-6 w-6',
      logo: 'h-4 w-4',
      text: 'text-base',
    },
  }[size]

  return (
    <Link
      className={`flex items-center gap-2 ${linkToHome ? 'cursor-pointer' : 'cursor-default'}`}
      to={linkToHome ? '/' : '.'}
    >
      <div className={`flex items-center justify-center rounded-lg bg-primary ${brandStyles.icon}`}>
        <LeafIcon className={`${brandStyles.logo} text-white`} weight="fill" />
      </div>
      <span className={`font-semibold text-primary ${brandStyles.text}`}>GreenCart</span>
    </Link>
  )
}

export default Brand
