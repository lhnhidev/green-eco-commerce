import { Anchor, Breadcrumbs, Select } from '@mantine/core'
import { useGetApiProductsSome } from '../../api'
import ProductCardv2 from '../../components/features/products/ProductCardv2'
import Loading from '../../components/ui/status/Loading'

const items = [
  { id: 1, title: 'Home', href: '/' },
  { id: 2, title: 'Products', href: '/products' },
].map((item) => (
  <Anchor href={item.href} key={item.id}>
    {item.title}
  </Anchor>
))

const ProductPage = () => {
  const productsAmount = 8

  const {
    data: products,
    isLoading,
    isError,
  } = useGetApiProductsSome({
    PageNumber: 1,
    PageSize: productsAmount,
  })

  if (isLoading) {
    return <Loading text="Loading..."></Loading>
  }

  if (isError) {
    return <div>Can't load products now</div>
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-10">
      <Breadcrumbs>{items}</Breadcrumbs>

      <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-bold text-4xl text-primary mb-2">Green Product</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Discover everyday essentials designed with the planet in mind. Every item in our collection meets rigorous
            environmental standards.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            classNames={{ label: '!mb-2 !font-semibold !uppercase !text-md' }}
            label="Sort by:"
            placeholder="Pick value"
            data={['React', 'Angular', 'Vue', 'Svelte']}
          />
        </div>
      </div>

      <div className="flex gap-18~ mt-12">
        <aside className="w-full lg:w-64 space-y-10 shrink-0">
          <section>
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-6 font-bold">
              Sustainability
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  type="checkbox"
                />
                <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">Organic</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  type="checkbox"
                />
                <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">
                  Biodegradable
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  type="checkbox"
                />
                <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">
                  Recycled
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  type="checkbox"
                />
                <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">
                  Fair Trade
                </span>
              </label>
            </div>
          </section>
          <section>
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-6 font-bold">
              Category
            </h3>
            <div className="space-y-3">
              <a className="block font-body-md text-primary font-medium" href="/">
                All Essentials
              </a>
              <a className="block font-body-md text-on-surface-variant hover:text-primary transition-colors" href="/">
                Bath & Personal Care
              </a>
              <a className="block font-body-md text-on-surface-variant hover:text-primary transition-colors" href="/">
                Kitchen & Dining
              </a>
              <a className="block font-body-md text-on-surface-variant hover:text-primary transition-colors" href="/">
                Living & Textiles
              </a>
              <a className="block font-body-md text-on-surface-variant hover:text-primary transition-colors" href="/">
                Zero-Waste Kits
              </a>
            </div>
          </section>
          <section>
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-6 font-bold">
              Price Range
            </h3>
            <div className="space-y-4">
              <input
                className="w-full accent-primary h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
                type="range"
              />
              <div className="flex justify-between font-label-md text-on-surface-variant">
                <span>$0</span>
                <span>$200+</span>
              </div>
            </div>
          </section>
          {/** biome-ignore lint/a11y/useButtonType: <> */}
          <button className="w-full py-3 border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-white transition-all">
            Clear All Filters
          </button>
        </aside>

        <div className="grid grid-cols-4 gap-3">
          {products?.map((product) => {
            return <ProductCardv2 key={product.id} product={product} />
          })}
        </div>
      </div>
    </div>
  )
}

export default ProductPage
