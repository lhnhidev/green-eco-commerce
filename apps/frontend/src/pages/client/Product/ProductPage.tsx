import { useGetAllCategories, useGetAllProducts } from '@api'
import ProductCard from '@components/features/products/ProductCard'
import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Seo from '@components/ui/Seo'
import {
  Badge,
  Checkbox,
  Collapse,
  Input,
  Pagination,
  RangeSlider,
  Select,
  Skeleton,
  type TreeNodeData,
  TreeSelect,
} from '@mantine/core'
import {
  CurrencyDollarIcon,
  DropIcon,
  FunnelIcon,
  LeafIcon,
  ListDashesIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  PlantIcon,
  RecycleIcon,
  WarningCircleIcon,
  XCircleIcon,
  XIcon,
} from '@phosphor-icons/react'
import { buildCategoryTree, type CategoryTreeNode } from '@utils/buildCategoryTree'
import { formatCurrency } from '@utils/formatCurrency'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ProductSortBy } from '@/api/schemas'

const MAX_PRICE = 1000

// ─── Reusable filter panel (shared between desktop sidebar and mobile Collapse) ─

interface FilterPanelProps {
  treeSelectData: TreeNodeData[]
  categoryId: string
  setCategoryId: (v: string) => void
  isOrganic: boolean
  setIsOrganic: (v: boolean) => void
  isBiodegradable: boolean
  setIsBiodegradable: (v: boolean) => void
  isRecycled: boolean
  setIsRecycled: (v: boolean) => void
  inStockOnly: boolean
  setInStockOnly: (v: boolean) => void
  priceRange: [number, number]
  onPriceRangeChange: (v: [number, number]) => void
  onPriceRangeChangeEnd: (v: [number, number]) => void
  onClear: () => void
}

const FilterPanel = ({
                       treeSelectData, categoryId, setCategoryId,
                       isOrganic, setIsOrganic,
                       isBiodegradable, setIsBiodegradable,
                       isRecycled, setIsRecycled,
                       inStockOnly, setInStockOnly,
                       priceRange, onPriceRangeChange, onPriceRangeChangeEnd,
                       onClear,
                     }: FilterPanelProps) => (
  <>
    <div
      className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <h3 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
        <div className="bg-green-100 p-1 rounded text-green-700"><ListDashesIcon weight="bold" size={14} /></div>
        Categories
      </h3>
      <TreeSelect
        data={treeSelectData}
        value={categoryId}
        onChange={(val) => setCategoryId(val || '')}
        placeholder="All Essentials"
        clearable searchable size="sm" radius="md"
        classNames={{ input: 'border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 bg-gray-50/50 hover:bg-white transition-all text-gray-700 font-medium' }}
      />
    </div>

    <div
      className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <h3 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
        <div className="bg-emerald-100 p-1 rounded text-emerald-700"><LeafIcon weight="fill" size={14} /></div>
        Sustainability
      </h3>
      <div className="space-y-4 px-1">
        <Checkbox
          label={<div className="flex items-center gap-2"><PlantIcon size={16} className="text-green-600" /><span
            className="text-sm">Organic</span></div>}
          checked={isOrganic} onChange={(e) => setIsOrganic(e.currentTarget.checked)} color="green.6" size="sm"
          classNames={{
            label: 'text-gray-700 font-medium cursor-pointer ml-2',
            input: 'cursor-pointer transition-colors hover:border-green-400'
          }}
        />
        <Checkbox label={<div className="flex items-center gap-2"><DropIcon size={16} className="text-blue-500" /><span
          className="text-sm">Biodegradable</span></div>}
                  checked={isBiodegradable} onChange={(e) => setIsBiodegradable(e.currentTarget.checked)}
                  color="green.6" size="sm"
                  classNames={{
                    label: 'text-gray-700 font-medium cursor-pointer ml-2',
                    input: 'cursor-pointer transition-colors hover:border-green-400'
                  }}
        />
        <Checkbox
          label={<div className="flex items-center gap-2"><RecycleIcon size={16} className="text-emerald-500" /><span
            className="text-sm">Recycled</span></div>}
          checked={isRecycled} onChange={(e) => setIsRecycled(e.currentTarget.checked)} color="green.6" size="sm"
          classNames={{
            label: 'text-gray-700 font-medium cursor-pointer ml-2',
            input: 'cursor-pointer transition-colors hover:border-green-400'
          }}
        />
        <Checkbox
          label={<div className="flex items-center gap-2"><PackageIcon size={16} className="text-gray-600" /><span
            className="text-sm">In stock only</span></div>}
          checked={inStockOnly} onChange={(e) => setInStockOnly(e.currentTarget.checked)} color="green.6" size="sm"
          classNames={{
            label: 'text-gray-700 font-medium cursor-pointer ml-2',
            input: 'cursor-pointer transition-colors hover:border-green-400'
          }}
        />
      </div>
    </div>

    <div
      className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 pb-8">
      <h3 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
        <div className="bg-blue-100 p-1 rounded text-blue-700"><CurrencyDollarIcon weight="bold" size={14} /></div>
        Price Range
      </h3>
      <div className="space-y-4 px-2">
        <div className="text-green-700 font-bold text-lg tracking-tight text-center">
          {formatCurrency(priceRange[0])} – {priceRange[1] >= MAX_PRICE ? `${formatCurrency(MAX_PRICE)}+` : formatCurrency(priceRange[1])}
        </div>
        <RangeSlider
          color="green.6" size="sm" radius="xl" min={0} max={MAX_PRICE} step={10}
          value={priceRange}
          onChange={onPriceRangeChange}
          onChangeEnd={onPriceRangeChangeEnd}
          marks={[{ value: 0, label: '$0' }, { value: MAX_PRICE, label: `$${MAX_PRICE}+` }]}
          classNames={{
            markLabel: 'text-[10px] font-bold tracking-wider text-gray-400 mt-2',
            thumb: 'border-2 border-white shadow-sm'
          }}
        />
      </div>
    </div>

    <button type="button" onClick={onClear}
            className="w-full py-2.5 px-4 bg-white border border-gray-200 text-gray-500 font-bold text-sm rounded-xl hover:border-red-200 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
    >
      <XCircleIcon weight="fill" size={18} />
      Clear All Filters
    </button>
  </>
)

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Products', href: '/products' },
]

const productsAmount = 12

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // The URL is the single source of truth for every filter except the live text of the
  // search box (which shouldn't hit the URL on every keystroke, only on submit) and the
  // price range thumbs while actively dragging (see priceRange state below).
  const pageNumber = Number(searchParams.get('page') ?? 1)
  const categoryId = searchParams.get('categoryId') ?? ''
  const sortBy = (searchParams.get('sortBy') as ProductSortBy) || ProductSortBy.Name
  const sortOrder = (searchParams.get('order') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc'
  const minPrice = Number(searchParams.get('minPrice') ?? 0)
  const maxPrice = Number(searchParams.get('maxPrice') ?? MAX_PRICE)
  const isOrganic = searchParams.get('organic') === 'true'
  const isBiodegradable = searchParams.get('biodegradable') === 'true'
  const isRecycled = searchParams.get('recycled') === 'true'
  const inStockOnly = searchParams.get('inStock') === 'true'
  const currentSearch = searchParams.get('search') || ''

  const [searchName, setSearchName] = useState(currentSearch)
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Keep the search box and the price slider's live position in sync when the URL
  // changes from elsewhere (Clear Filters, browser back/forward, a category link).
  useEffect(() => setSearchName(currentSearch), [currentSearch])
  useEffect(() => setPriceRange([minPrice, maxPrice]), [minPrice, maxPrice])

  const updateParams = (patch: Record<string, string | null>, resetPage = true) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === '') next.delete(key)
        else next.set(key, value)
      })
      if (resetPage) next.delete('page')
      return next
    })
  }

  const { data: categoriesData } = useGetAllCategories()

  const treeSelectData = useMemo(() => {
    if (!categoriesData) return []

    // Adapt the shared category tree into Mantine TreeSelect's node shape,
    // omitting empty `children` arrays so leaf nodes don't render an expand arrow.
    const toTreeNodeData = (nodes: CategoryTreeNode[]): TreeNodeData[] =>
      nodes.map((node) => ({
        label: `${node.name} (${node.productCount})`,
        value: node.id,
        ...(node.children.length > 0 ? { children: toTreeNodeData(node.children) } : {}),
      }))

    return toTreeNodeData(buildCategoryTree(categoriesData))
  }, [categoriesData])

  const selectedCategoryName = useMemo(() => {
    if (!categoryId || !categoriesData) return null
    return categoriesData.find((c) => c.id === categoryId)?.name ?? null
  }, [categoryId, categoriesData])

  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetAllProducts({
    pageNumber: pageNumber,
    pageSize: productsAmount,
    search: currentSearch || undefined,
    categoryIds: categoryId !== '' ? [categoryId] : [],
    minPrice: minPrice,
    maxPrice: maxPrice >= MAX_PRICE ? undefined : maxPrice,
    sortBy: sortBy,
    sortDescending: sortOrder === 'desc',
    isOrganic: isOrganic,
    isBiodegradable: isBiodegradable,
    isRecycled: isRecycled,
  })

  // The backend has no "in stock" filter — this narrows the already-fetched page,
  // same page-scoped-filter pattern used for order status filtering elsewhere in the app.
  const visibleItems = useMemo(() => {
    const items = productsData?.items ?? []
    return inStockOnly ? items.filter((p) => p.stockQty > 0) : items
  }, [productsData, inStockOnly])

  const handleSearch = () => {
    const trimmed = searchName.trim()
    setSearchName(trimmed)
    updateParams({ search: trimmed || null })
  }

  const handleClearFilters = () => {
    setSearchParams({})
  }

  const handlePageChange = (page: number) => {
    updateParams({ page: page > 1 ? String(page) : null }, false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []

    if (currentSearch) {
      chips.push({ key: 'search', label: `"${currentSearch}"`, onRemove: () => updateParams({ search: null }) })
    }
    if (categoryId && selectedCategoryName) {
      chips.push({
        key: 'category',
        label: selectedCategoryName,
        onRemove: () => updateParams({ categoryId: null }),
      })
    }
    if (isOrganic) {
      chips.push({ key: 'organic', label: 'Organic', onRemove: () => updateParams({ organic: null }) })
    }
    if (isBiodegradable) {
      chips.push({
        key: 'biodegradable',
        label: 'Biodegradable',
        onRemove: () => updateParams({ biodegradable: null }),
      })
    }
    if (isRecycled) {
      chips.push({ key: 'recycled', label: 'Recycled', onRemove: () => updateParams({ recycled: null }) })
    }
    if (inStockOnly) {
      chips.push({ key: 'inStock', label: 'In stock only', onRemove: () => updateParams({ inStock: null }) })
    }
    if (minPrice > 0 || maxPrice < MAX_PRICE) {
      chips.push({
        key: 'price',
        label: `${formatCurrency(minPrice)} – ${maxPrice >= MAX_PRICE ? `${formatCurrency(MAX_PRICE)}+` : formatCurrency(maxPrice)}`,
        onRemove: () => updateParams({ minPrice: null, maxPrice: null }),
      })
    }

    return chips
  }, [currentSearch, categoryId, selectedCategoryName, isOrganic, isBiodegradable, isRecycled, inStockOnly, minPrice, maxPrice])

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      <Seo
        title={currentSearch ? `Search: ${currentSearch}` : 'Shop Sustainable Essentials'}
        description="Browse eco-friendly, sustainable products with a transparent carbon footprint on every item."
      />
      {/* Hero Section */}
      <div
        className="bg-linear-to-br from-green-950 via-green-900 to-emerald-800 text-white py-16 px-4 relative overflow-hidden">
        {/* Subtle background circles for premium feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 size-100 bg-green-500/20 rounded-full blur-[80px] animate-pulse" />
          <div
            className="absolute -bottom-32 -left-32 size-100 bg-emerald-400/20 rounded-full blur-[90px] animate-pulse"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
        </div>

        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          <PageBreadcrumbs
            items={breadcrumbItems}
            className="mb-6"
            separator="›"
            classNames={{
              breadcrumb:
                'text-green-200/70 hover:text-white transition-colors text-[11px] font-bold tracking-widest uppercase',
              separator: 'text-white/30',
            }}
          />
          <div className="max-w-3xl">
            <h1
              className="font-extrabold text-4xl md:text-5xl mb-4 tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-green-100 drop-shadow-sm">
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
        <div
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-2xl">
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
              updateParams({ sortBy: newSortBy, order: newSortOrder })
            }}
            data={[
              { value: `${ProductSortBy.Name}|asc`, label: 'Name (A-Z)' },
              { value: `${ProductSortBy.Name}|desc`, label: 'Name (Z-A)' },
              { value: `${ProductSortBy.Price}|asc`, label: 'Price (Low to High)' },
              { value: `${ProductSortBy.Price}|desc`, label: 'Price (High to Low)' },
              { value: `${ProductSortBy.CarbonIndex}|asc`, label: 'Carbon Impact (Low to High)' },
              { value: `${ProductSortBy.CarbonIndex}|desc`, label: 'Carbon Impact (High to Low)' },
              { value: `${ProductSortBy.Newest}|desc`, label: 'Newest Arrivals' },
              { value: `${ProductSortBy.Rating}|desc`, label: 'Highest Rated' },
              { value: `${ProductSortBy.BestSelling}|desc`, label: 'Best Selling' },
            ]}
            classNames={{
              input:
                'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all w-full md:w-56 bg-gray-50/50 hover:bg-white text-gray-700 font-medium',
            }}
          />
        </div>

        {/* Active filter chips */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {activeFilterChips.map((chip) => (
              <Badge
                key={chip.key}
                variant="light"
                color="green"
                radius="xl"
                size="lg"
                className="!pr-1 !normal-case !font-semibold"
                rightSection={
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-green-200/60 transition-colors"
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    <XIcon size={10} />
                  </button>
                }
              >
                {chip.label}
              </Badge>
            ))}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm px-4 py-2 rounded-xl shadow-sm hover:border-green-300 hover:text-green-700 transition-all"
          >
            <FunnelIcon size={16} weight="bold" />
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar wrapper */}
          <div className="w-full lg:w-64 lg:shrink-0">
            {/* Desktop: always show */}
            <aside className="hidden lg:flex flex-col gap-4">
              <FilterPanel
                treeSelectData={treeSelectData}
                categoryId={categoryId}
                setCategoryId={(v) => updateParams({ categoryId: v || null })}
                isOrganic={isOrganic} setIsOrganic={(v) => updateParams({ organic: v ? 'true' : null })}
                isBiodegradable={isBiodegradable}
                setIsBiodegradable={(v) => updateParams({ biodegradable: v ? 'true' : null })}
                isRecycled={isRecycled} setIsRecycled={(v) => updateParams({ recycled: v ? 'true' : null })}
                inStockOnly={inStockOnly} setInStockOnly={(v) => updateParams({ inStock: v ? 'true' : null }, false)}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onPriceRangeChangeEnd={(v) =>
                  updateParams({ minPrice: v[0] > 0 ? String(v[0]) : null, maxPrice: v[1] < MAX_PRICE ? String(v[1]) : null })
                }
                onClear={handleClearFilters}
              />
            </aside>

            {/* Mobile: Collapse-toggled */}
            <Collapse expanded={filtersOpen} className="lg:hidden">
              <aside className="flex flex-col gap-4 pb-2">
                <FilterPanel
                  treeSelectData={treeSelectData}
                  categoryId={categoryId}
                  setCategoryId={(v) => updateParams({ categoryId: v || null })}
                  isOrganic={isOrganic} setIsOrganic={(v) => updateParams({ organic: v ? 'true' : null })}
                  isBiodegradable={isBiodegradable}
                  setIsBiodegradable={(v) => updateParams({ biodegradable: v ? 'true' : null })}
                  isRecycled={isRecycled} setIsRecycled={(v) => updateParams({ recycled: v ? 'true' : null })}
                  inStockOnly={inStockOnly}
                  setInStockOnly={(v) => updateParams({ inStock: v ? 'true' : null }, false)}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  onPriceRangeChangeEnd={(v) =>
                    updateParams({ minPrice: v[0] > 0 ? String(v[0]) : null, maxPrice: v[1] < MAX_PRICE ? String(v[1]) : null })
                  }
                  onClear={handleClearFilters}
                />
              </aside>
            </Collapse>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {currentSearch && (
              <div
                className="bg-white/80 backdrop-blur-md px-5 py-4 rounded-2xl flex items-center justify-between mb-6 shadow-sm border border-gray-100">
                <p className="font-medium text-sm text-gray-700 flex items-center gap-2">
                  <MagnifyingGlassIcon size={18} className="text-green-600" />
                  Search results for: <span className="font-black text-green-700">"{currentSearch}"</span>
                  <span className="text-gray-400 font-normal ml-1">({productsData?.totalCount ?? 0} products)</span>
                </p>
                <button
                  type="button"
                  onClick={() => updateParams({ search: null })}
                  className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-full"
                >
                  <XCircleIcon weight="fill" size={14} />
                  Clear
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
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
              <div
                className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-red-100 h-full">
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
            ) : visibleItems.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 h-full">
                <div
                  className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-5 shadow-inner border border-gray-100">
                  <MagnifyingGlassIcon weight="duotone" size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">No products found</h3>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-6">
                  {inStockOnly && (productsData?.items?.length ?? 0) > 0
                    ? "No in-stock products on this page match your filters. Try clearing 'In stock only' or checking another page."
                    : "We couldn't find any products matching your current filters. Try adjusting your search criteria."}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  {visibleItems.map((product) => (
                    <div key={product.id} className="animate__animated animate__fadeIn">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {productsData && productsData.totalPages > 1 && (
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
