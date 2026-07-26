import { useGetAllCategories, useGetAllProducts } from '@api'
import ProductCardv2 from '@components/features/products/ProductCardv2'
import {
  Anchor,
  Breadcrumbs,
  Checkbox,
  Input,
  Pagination,
  Select,
  Skeleton,
  Slider,
  type TreeNodeData,
  TreeSelect,
} from '@mantine/core'
import {
  CurrencyDollarIcon,
  DropIcon,
  LeafIcon,
  ListDashesIcon,
  MagnifyingGlassIcon,
  PlantIcon,
  RecycleIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ProductSortBy } from '@/api/schemas'

const items = [
  { id: 1, title: 'Home', href: '/' },
  { id: 2, title: 'Products', href: '/products' },
].map((item) => (
  <Anchor href={item.href} key={item.id}>
    {item.title}
  </Anchor>
))

const productsAmount = 12

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSearch = searchParams.get('search') || ''

  const [pageNumber, setPageNumber] = useState(1)
  const [searchName, setSearchName] = useState(currentSearch)

  const [categoryId, setCategoryId] = useState<string>('')
  const [sortBy, setSortBy] = useState<ProductSortBy>(ProductSortBy.Name)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(1000)

  const [isOrganic, setIsOrganic] = useState(false)
  const [isBiodegradable, setIsBiodegradable] = useState(false)
  const [isRecycled, setIsRecycled] = useState(false)

  const { data: categoriesData } = useGetAllCategories()

  const treeSelectData = useMemo(() => {
    if (!categoriesData) return []

    const nodeMap = new Map<string, TreeNodeData>()
    const roots: TreeNodeData[] = []

    // First pass: create node objects
    categoriesData.forEach((cat) => {
      nodeMap.set(cat.id, { label: `${cat.name} (${cat.productCount})`, value: cat.id, children: [] })
    })

    // Second pass: attach to parents
    categoriesData.forEach((cat) => {
      const node = nodeMap.get(cat.id)
      if (!node) return

      if (cat.parentId && nodeMap.has(cat.parentId)) {
        const parent = nodeMap.get(cat.parentId)
        if (parent?.children) {
          parent.children.push(node)
        }
      } else {
        roots.push(node)
      }
    })

    // Clean up empty children arrays
    const cleanEmptyChildren = (nodes: TreeNodeData[]) => {
      nodes.forEach((node) => {
        if (node.children && node.children.length === 0) {
          delete node.children
        } else if (node.children) {
          cleanEmptyChildren(node.children)
        }
      })
    }
    cleanEmptyChildren(roots)

    return roots
  }, [categoriesData])

  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetAllProducts({
    pageNumber: pageNumber,
    pageSize: productsAmount,
    search: searchName || undefined,
    categoryIds: categoryId !== '' ? [categoryId] : [],
    minPrice: minPrice,
    maxPrice: maxPrice === 1000 ? undefined : maxPrice,
    sortBy: sortBy,
    sortDescending: sortOrder === 'desc',
    isOrganic: isOrganic,
    isBiodegradable: isBiodegradable,
    isRecycled: isRecycled,
  })

  const handleSearch = () => {
    const trimmed = searchName.trim()
    setSearchName(trimmed)
    setPageNumber(1)

    setSearchParams((prevParams) => {
      if (trimmed) {
        prevParams.set('search', trimmed)
      } else {
        prevParams.delete('search')
      }
      return prevParams
    })
  }

  const handleClearFilters = () => {
    setSearchName('')
    setCategoryId('')
    setSortBy(ProductSortBy.Name)
    setSortOrder('asc')
    setMinPrice(0)
    setMaxPrice(1000)
    setIsOrganic(false)
    setIsBiodegradable(false)
    setIsRecycled(false)
    setPageNumber(1)
    setSearchParams({})
  }

  const handlePageChange = (page: number) => {
    setPageNumber(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-green-950 via-green-900 to-emerald-800 text-white py-16 px-4 relative overflow-hidden">
        {/* Subtle background circles for premium feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 size-100 bg-green-500/20 rounded-full blur-[80px] animate-pulse" />
          <div
            className="absolute -bottom-32 -left-32 size-100 bg-emerald-400/20 rounded-full blur-[90px] animate-pulse"
            style={{ animationDelay: '2s' }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
        </div>

        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          <Breadcrumbs
            className="mb-6"
            separator="›"
            classNames={{
              breadcrumb:
                'text-green-200/70 hover:text-white transition-colors text-[11px] font-bold tracking-widest uppercase',
              separator: 'text-white/30',
            }}
          >
            {items}
          </Breadcrumbs>
          <div className="max-w-3xl">
            <h1 className="font-extrabold text-4xl md:text-5xl mb-4 tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-green-100 drop-shadow-sm">
              Sustainable Essentials
            </h1>
            <p className="text-base md:text-lg text-green-100/90 max-w-xl mx-auto leading-relaxed font-light">
              Discover everyday items designed with the planet in mind. Zero compromise on quality, 100% committed to
              nature.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Search & Sort Bar */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-2xl">
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
              placeholder="Search eco-friendly products..."
              leftSection={<MagnifyingGlassIcon size={20} className="text-gray-400" />}
              classNames={{
                input:
                  'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all bg-gray-50/50 hover:bg-white text-gray-700 font-medium placeholder:text-gray-400 placeholder:font-normal',
              }}
            />
          </form>
          <Select
            size="md"
            radius="xl"
            placeholder="Sort by"
            value={`${sortBy}|${sortOrder}`}
            onChange={(val) => {
              const [newSortBy, newSortOrder] = (val || '').split('|')
              setSortBy(newSortBy as ProductSortBy)
              setSortOrder(newSortOrder as 'asc' | 'desc')
              setPageNumber(1)
            }}
            data={[
              { value: `${ProductSortBy.Name}|asc`, label: 'Name (A-Z)' },
              { value: `${ProductSortBy.Name}|desc`, label: 'Name (Z-A)' },
              { value: `${ProductSortBy.Price}|asc`, label: 'Price (Low to High)' },
              { value: `${ProductSortBy.Price}|desc`, label: 'Price (High to Low)' },
              { value: `${ProductSortBy.CarbonIndex}|asc`, label: 'Carbon Impact (Low to High)' },
              { value: `${ProductSortBy.CarbonIndex}|desc`, label: 'Carbon Impact (High to Low)' },
            ]}
            classNames={{
              input:
                'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all w-full md:w-56 bg-gray-50/50 hover:bg-white text-gray-700 font-medium',
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-4">
            <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
                <div className="bg-green-100 p-1 rounded text-green-700">
                  <ListDashesIcon weight="bold" size={14} />
                </div>
                Categories
              </h3>
              <TreeSelect
                data={treeSelectData}
                value={categoryId}
                onChange={(val) => {
                  setCategoryId(val || '')
                  setPageNumber(1)
                }}
                placeholder="All Essentials"
                clearable
                searchable
                size="sm"
                radius="md"
                classNames={{
                  input:
                    'border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 bg-gray-50/50 hover:bg-white transition-all text-gray-700 font-medium',
                }}
              />
            </div>

            <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
                <div className="bg-emerald-100 p-1 rounded text-emerald-700">
                  <LeafIcon weight="fill" size={14} />
                </div>
                Sustainability
              </h3>
              <div className="space-y-4 px-1">
                <Checkbox
                  label={
                    <div className="flex items-center gap-2">
                      <PlantIcon size={16} className="text-green-600" />
                      <span className="text-sm">Organic</span>
                    </div>
                  }
                  checked={isOrganic}
                  onChange={(e) => {
                    setIsOrganic(e.currentTarget.checked)
                    setPageNumber(1)
                  }}
                  color="green.6"
                  size="sm"
                  classNames={{
                    label: 'text-gray-700 font-medium cursor-pointer ml-2',
                    input: 'cursor-pointer transition-colors hover:border-green-400',
                  }}
                />
                <Checkbox
                  label={
                    <div className="flex items-center gap-2">
                      <DropIcon size={16} className="text-blue-500" />
                      <span className="text-sm">Biodegradable</span>
                    </div>
                  }
                  checked={isBiodegradable}
                  onChange={(e) => {
                    setIsBiodegradable(e.currentTarget.checked)
                    setPageNumber(1)
                  }}
                  color="green.6"
                  size="sm"
                  classNames={{
                    label: 'text-gray-700 font-medium cursor-pointer ml-2',
                    input: 'cursor-pointer transition-colors hover:border-green-400',
                  }}
                />
                <Checkbox
                  label={
                    <div className="flex items-center gap-2">
                      <RecycleIcon size={16} className="text-emerald-500" />
                      <span className="text-sm">Recycled</span>
                    </div>
                  }
                  checked={isRecycled}
                  onChange={(e) => {
                    setIsRecycled(e.currentTarget.checked)
                    setPageNumber(1)
                  }}
                  color="green.6"
                  size="sm"
                  classNames={{
                    label: 'text-gray-700 font-medium cursor-pointer ml-2',
                    input: 'cursor-pointer transition-colors hover:border-green-400',
                  }}
                />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 pb-8">
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
                <div className="bg-blue-100 p-1 rounded text-blue-700">
                  <CurrencyDollarIcon weight="bold" size={14} />
                </div>
                Price Range
              </h3>
              <div className="space-y-4 px-2">
                <div className="text-green-700 font-bold text-xl tracking-tight text-center">
                  Up to ${maxPrice === 1000 ? '1000+' : maxPrice}
                </div>
                <Slider
                  color="green.6"
                  size="sm"
                  radius="xl"
                  min={0}
                  max={1000}
                  step={10}
                  value={maxPrice}
                  onChange={(val) => {
                    setMaxPrice(val)
                    setPageNumber(1)
                  }}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 1000, label: '$1000+' },
                  ]}
                  classNames={{
                    markLabel: 'text-[10px] font-bold tracking-wider text-gray-400 mt-2',
                    thumb: 'border-2 border-white shadow-sm',
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full py-2.5 px-4 bg-white border border-gray-200 text-gray-500 font-bold text-sm rounded-xl hover:border-red-200 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <XCircleIcon weight="fill" size={18} />
              Clear All Filters
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {searchName && (
              <div className="bg-white/80 backdrop-blur-md px-5 py-4 rounded-2xl flex items-center justify-between mb-6 shadow-sm border border-gray-100">
                <p className="font-medium text-sm text-gray-700 flex items-center gap-2">
                  <MagnifyingGlassIcon size={18} className="text-green-600" />
                  Search results for: <span className="font-black text-green-700">"{searchName}"</span>
                  <span className="text-gray-400 font-normal ml-1">({productsData?.totalCount ?? 0} products)</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchName('')
                    setPageNumber(1)
                    setSearchParams({})
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-full"
                >
                  <XCircleIcon weight="fill" size={14} />
                  Clear
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton loader.
                    key={i}
                    className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <Skeleton height={200} radius="xl" className="w-full" />
                    <Skeleton height={24} radius="xl" className="w-3/4 mt-3" />
                    <Skeleton height={14} radius="xl" className="w-full mt-1" />
                    <Skeleton height={14} radius="xl" className="w-4/5" />
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton height={28} width={80} radius="xl" />
                      <Skeleton height={40} width={40} radius="xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-red-100 h-full">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5 shadow-inner">
                  <WarningCircleIcon weight="fill" size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-500 text-sm max-w-sm mb-6">
                  We couldn't load the products at this time. Please try refreshing the page.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="py-3 px-6 text-sm bg-linear-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Refresh Page
                </button>
              </div>
            ) : !productsData?.items || productsData.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 h-full">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-5 shadow-inner border border-gray-100">
                  <MagnifyingGlassIcon weight="duotone" size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">No products found</h3>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-6">
                  We couldn't find any products matching your current filters. Try adjusting your search criteria.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="py-3 px-6 text-sm bg-linear-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl hover:shadow-md hover:shadow-green-500/20 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <XCircleIcon weight="fill" size={18} />
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {productsData.items.map((product) => (
                    <div key={product.id} className="animate__animated animate__fadeIn">
                      <ProductCardv2 product={product} />
                    </div>
                  ))}
                </div>

                {productsData.totalPages > 1 && (
                  <div className="mt-10 flex justify-center pb-6">
                    <Pagination
                      total={productsData.totalPages}
                      value={pageNumber}
                      onChange={handlePageChange}
                      color="green.6"
                      size="md"
                      radius="xl"
                      withEdges
                      classNames={{
                        control:
                          'border-none shadow-sm hover:shadow-md transition-all bg-white font-bold text-gray-600 hover:text-green-600',
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
