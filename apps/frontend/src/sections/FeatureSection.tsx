import type { ReactElement } from 'react'

type FeatureSectionProp = {
  backgroundColor: string | null
  title: string
  description: string
  contentComponent: ReactElement
}

const FeatureSection = ({ title, description, contentComponent, backgroundColor }: FeatureSectionProp) => {
  return (
    <section className={`py-16 ${backgroundColor === null ? '' : backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{description}</p>
        </div>
        {contentComponent}
      </div>
    </section>
  )
}

export default FeatureSection
