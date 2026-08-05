import Section from '@components/ui/primitives/Section'
import type { ReactElement, ReactNode } from 'react'

type FeatureSectionProp = {
  tone?: 'default' | 'subtle' | 'brand'
  title: string
  description: string
  action?: ReactNode
  contentComponent: ReactElement
}

const FeatureSection = ({ title, description, action, contentComponent, tone = 'default' }: FeatureSectionProp) => {
  return (
    <Section tone={tone} size="md">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">{description}</p>
        </div>
        {action}
      </div>
      {contentComponent}
    </Section>
  )
}

export default FeatureSection
