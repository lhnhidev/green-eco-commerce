import { useGetApiCategories, useGetApiProductsSome } from '@api'
import ProductCardv2 from '@components/features/products/ProductCardv2'
import { Anchor, Breadcrumbs, Checkbox, Input, Pagination, Select, Skeleton } from '@mantine/core'
import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'

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

  const [pageNumber, setPageNumber] = useState(1)
  const [searchName, setSearchName] = useState<string>('')
  const [triggerSearch, setTriggerSearch] = useState<string>('')

  const [categoryId, setCategoryId] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')

  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(1000)

  const [isOrganic, setIsOrganic] = useState(false)
  const [isBiodegradable, setIsBiodegradable] = useState(false)
  const [isRecycled, setIsRecycled] = useState(false)

  const { data: categoriesData } = useGetApiCategories()

  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetApiProductsSome({
    PageNumber: pageNumber,
    PageSize: productsAmount,
    SearchTerm: triggerSearch || undefined,
    CategoryId: categoryId || undefined,
    MinPrice: minPrice,
    MaxPrice: maxPrice === 1000 ? undefined : maxPrice,
    SortBy: sortBy ? sortBy.split('|')[0] : undefined,
    IsDescending: sortBy ? sortBy.split('|')[1] === 'desc' : undefined,
    IsOrganic: isOrganic || undefined,
    IsBiodegradable: isBiodegradable || undefined,
    IsRecycled: isRecycled || undefined,
  })

  const handleSearch = () => {
    setTriggerSearch(searchName.trim())
    setPageNumber(1)
  }

  const handleClearFilters = () => {
    setTriggerSearch('')
    setSearchName('')
    setCategoryId('')
    setSortBy('')
    setMinPrice(0)
    setMaxPrice(1000)
    setIsOrganic(false)
    setIsBiodegradable(false)
    setIsRecycled(false)
    setPageNumber(1)
  }

  const handlePageChange = (page: number) => {
    setPageNumber(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-600 text-white py-20 px-4 relative overflow-hidden">
        {/* Subtle background circles for premium feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div
            className="absolute top-24 -left-24 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <Breadcrumbs
            className="mb-6"
            classNames={{
              breadcrumb: 'text-green-100 hover:text-white transition-colors text-sm font-medium',
              separator: 'text-white!',
            }}
          >
            {items}
          </Breadcrumbs>
          <div className="max-w-3xl">
            <h1 className="font-extrabold text-5xl md:text-6xl mb-6 tracking-tight drop-shadow-sm">Green Product</h1>
            <p className="text-lg md:text-xl text-green-50 max-w-2xl leading-relaxed font-light">
              Discover everyday essentials designed with the planet in mind. Every item in our collection meets rigorous
              environmental standards.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {/* Search & Sort Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
            className="flex-1 w-full md:max-w-md"
          >
            <Input
              size="md"
              radius="xl"
              value={searchName}
              onChange={(event) => setSearchName(event.currentTarget.value)}
              placeholder="Search your eco-friendly product..."
              leftSection={<CiSearch size={20} className="text-gray-400" />}
              classNames={{
                input:
                  'border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all bg-gray-50/50 hover:bg-white',
              }}
            />
          </form>
          <Select
            size="md"
            radius="xl"
            placeholder="Sort by"
            value={sortBy}
            onChange={(val) => {
              setSortBy(val || '')
              setPageNumber(1)
            }}
            data={[
              { value: 'name|asc', label: 'Name (A-Z)' },
              { value: 'name|desc', label: 'Name (Z-A)' },
              { value: 'price|asc', label: 'Price (Low to High)' },
              { value: 'price|desc', label: 'Price (High to Low)' },
              { value: 'carbon|asc', label: 'Carbon Index (Low to High)' },
              { value: 'carbon|desc', label: 'Carbon Index (High to Low)' },
            ]}
            classNames={{
              input:
                'border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all w-full md:w-56 bg-gray-50/50 hover:bg-white',
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8">
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Category
              </h3>
              <div className="space-y-1.5">
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${categoryId === '' ? 'bg-green-50 text-green-700 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-green-600 font-medium'}`}
                  onClick={() => {
                    setCategoryId('')
                    setPageNumber(1)
                  }}
                >
                  All Essentials
                </button>
                {categoriesData?.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${categoryId === cat.id ? 'bg-green-50 text-green-700 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-green-600 font-medium'}`}
                    onClick={() => {
                      setCategoryId(cat.id)
                      setPageNumber(1)
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Sustainability
              </h3>
              <div className="space-y-4 px-1">
                <Checkbox
                  label="Organic"
                  checked={isOrganic}
                  onChange={(e) => {
                    setIsOrganic(e.currentTarget.checked)
                    setPageNumber(1)
                  }}
                  color="green.6"
                  size="sm"
                  classNames={{
                    label: 'text-gray-700 font-medium cursor-pointer',
                    input: 'cursor-pointer transition-colors',
                  }}
                />
                <Checkbox
                  label="Biodegradable"
                  checked={isBiodegradable}
                  onChange={(e) => {
                    setIsBiodegradable(e.currentTarget.checked)
                    setPageNumber(1)
                  }}
                  color="green.6"
                  size="sm"
                  classNames={{
                    label: 'text-gray-700 font-medium cursor-pointer',
                    input: 'cursor-pointer transition-colors',
                  }}
                />
                <Checkbox
                  label="Recycled"
                  checked={isRecycled}
                  onChange={(e) => {
                    setIsRecycled(e.currentTarget.checked)
                    setPageNumber(1)
                  }}
                  color="green.6"
                  size="sm"
                  classNames={{
                    label: 'text-gray-700 font-medium cursor-pointer',
                    input: 'cursor-pointer transition-colors',
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Price Range
              </h3>
              <div className="space-y-5 px-1">
                <div className="text-green-700 font-bold text-xl tracking-tight">
                  Up to ${maxPrice === 1000 ? '1000+' : maxPrice}
                </div>
                <input
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600 hover:accent-green-500 transition-colors"
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value))
                    setPageNumber(1)
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 font-semibold tracking-wider">
                  <span>$0</span>
                  <span>$1000+</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full py-4 px-6 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:border-green-600 hover:text-green-700 hover:bg-green-50/50 transition-all duration-300 shadow-sm active:scale-95"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {triggerSearch && (
              <div className="bg-green-50/80 backdrop-blur-sm text-green-900 px-6 py-4 rounded-2xl flex items-center justify-between mb-8 shadow-sm border border-green-100/50">
                <p className="font-medium">
                  Search results for: <span className="font-bold text-green-700">"{triggerSearch}"</span> (
                  {productsData?.totalCount ?? 0} products)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTriggerSearch('')
                    setSearchName('')
                    setPageNumber(1)
                  }}
                  className="text-sm font-bold text-green-600 hover:text-green-800 underline decoration-2 underline-offset-4 transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <Skeleton height={240} radius="xl" className="w-full" />
                    <Skeleton height={28} radius="xl" className="w-3/4 mt-2" />
                    <Skeleton height={16} radius="xl" className="w-full" />
                    <Skeleton height={16} radius="xl" className="w-5/6" />
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton height={24} width={80} radius="xl" />
                      <Skeleton height={40} width={40} radius="full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl shadow-sm border border-red-100 h-full">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  We couldn't load the products at this time. Please try refreshing the page.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="py-3 px-8 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors shadow-md hover:shadow-lg transform duration-200"
                >
                  Refresh Page
                </button>
              </div>
            ) : !productsData?.items || productsData.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl shadow-sm border border-gray-100 h-full">
                <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CiSearch size={56} className="text-gray-300" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">No products found</h3>
                <p className="text-gray-500 max-w-md text-lg leading-relaxed">
                  We couldn't find any products matching your current filters. Try adjusting your search criteria.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-8 py-3 px-8 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsData.items.map((product) => (
                    <div key={product.id} className="animate__animated animate__fadeIn">
                      <ProductCardv2 product={product} />
                    </div>
                  ))}
                </div>

                {productsData.totalPages > 1 && (
                  <div className="mt-14 flex justify-center pb-8">
                    <Pagination
                      total={productsData.totalPages}
                      value={pageNumber}
                      onChange={handlePageChange}
                      color="green"
                      size="lg"
                      radius="xl"
                      withEdges
                      classNames={{
                        control: 'border-none shadow-sm hover:shadow-md transition-shadow bg-white font-medium',
                        dots: 'text-gray-400',
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
