// React 19 hoists <title>/<meta>/<link> rendered anywhere in the tree up into <head> automatically,
// so this needs no extra dependency (react-helmet, etc.) or provider.
type SeoProps = {
  title: string
  description?: string
  image?: string
}

const Seo = ({ title, description, image }: SeoProps) => {
  const fullTitle = `${title} | GreenCart`

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={image ? 'product' : 'website'} />
      {image && <meta property="og:image" content={image} />}
    </>
  )
}

export default Seo
