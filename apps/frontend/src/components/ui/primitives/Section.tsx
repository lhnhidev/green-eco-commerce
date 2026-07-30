import Container from './Container'
import type { ComponentPropsWithoutRef } from 'react'

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  tone?: 'default' | 'subtle' | 'brand'
  /** `sm` (py-8), `md` (py-section / 40px, default), `lg` (py-section-lg / 56px — hero only). */
  size?: 'sm' | 'md' | 'lg'
  width?: 'page' | 'wide' | 'narrow'
  /** Skip the inner Container (e.g. for a full-bleed carousel). */
  noContainer?: boolean
}

const toneClasses: Record<NonNullable<SectionProps['tone']>, string> = {
  default: '',
  subtle: 'bg-surface-subtle',
  brand: 'plant-gradient',
}

const sizeClasses: Record<NonNullable<SectionProps['size']>, string> = {
  sm: 'py-8',
  md: 'py-section',
  lg: 'py-section-lg',
}

const Section = ({
  tone = 'default',
  size = 'md',
  width = 'page',
  noContainer,
  className,
  children,
  ...rest
}: SectionProps) => (
  <section className={`${toneClasses[tone]} ${sizeClasses[size]} ${className ?? ''}`} {...rest}>
    {noContainer ? children : <Container width={width}>{children}</Container>}
  </section>
)

export default Section
