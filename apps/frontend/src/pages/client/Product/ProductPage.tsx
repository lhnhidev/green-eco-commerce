import { useGetAllCategories, useGetAllMaterials, useGetAllProducts } from '@api'
import type { MaterialDto } from '@api/schemas'
import ProductCard from '@components/features/products/ProductCard'
import Container from '@components/ui/primitives/Container'
import EmptyState from '@components/ui/primitives/EmptyState'
import ProductGrid from '@components/ui/primitives/ProductGrid'
import Toolbar from '@components/ui/primitives/Toolbar'
import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Seo from '@components/ui/Seo'
import {
  Badge,
  Checkbox,
  Drawer,
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
  FlaskIcon,
  FunnelIcon,
  LeafIcon,
  ListDashesIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  PlantIcon,
  RecycleIcon,
  TreeIcon,
  WarningCircleIcon,
  XCircleIcon,
  XIcon,
} from '@phosphor-icons/react'
import { buildCategoryTree, type CategoryTreeNode } from '@utils/buildCategoryTree'
import { formatCurrency } from '@utils/formatCurrency'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { MaterialTypeEnum, ProductSortBy } from '@/api/schemas'

const MAX_PRICE = 1000

// The 5 remaining MaterialTypeEnum values (Biodegradable/Compostable were removed - they
// described post-use decomposability, not material origin, and now live in DecomposePercent).
const MATERIAL_TYPE_OPTIONS: { value: MaterialTypeEnum; label: string; icon: typeof PlantIcon; color: string }[] = [
  { value: MaterialTypeEnum.Natural, label: 'Natural', icon: TreeIcon, color: 'text-green-600' },
  { value: MaterialTypeEnum.Synthetic, label: 'Synthetic', icon: FlaskIcon, color: 'text-purple-500' },
  { value: MaterialTypeEnum.Recycled, label: 'Recycled', icon: RecycleIcon, color: 'text-emerald-500' },
  { value: MaterialTypeEnum.Organic, label: 'Organic', icon: PlantIcon, color: 'text-green-600' },
  { value: MaterialTypeEnum.BioBased, label: 'Bio-based', icon: DropIcon, color: 'text-blue-500' },
]

// ─── Reusable filter panel (shared between the desktop sticky rail and the mobile Drawer) ─

interface FilterPanelProps {
  treeSelectData: TreeNodeData[]
  categoryId: string
  setCategoryId: (v: string) => void
  materials: MaterialDto[]
  selectedMaterialIds: string[]
  toggleMaterial: (id: string) => void
  selectedMaterialTypes: MaterialTypeEnum[]
  toggleMaterialType: (type: MaterialTypeEnum) => void
  inStockOnly: boolean
  setInStockOnly: (v: boolean) => void
  priceRange: [number, number]
  onPriceRangeChange: (v: [number, number]) => void
  onPriceRangeChangeEnd: (v: [number, number]) => void
  onClear: () => void
}

const FilterPanel = ({
  treeSelectData,
  categoryId,
  setCategoryId,
  materials,
  selectedMaterialIds,
  toggleMaterial,
  selectedMaterialTypes,
  toggleMaterialType,
  inStockOnly,
  setInStockOnly,
  priceRange,
  onPriceRangeChange,
  onPriceRangeChangeEnd,
  onClear,
}: FilterPanelProps) => (
  <>
    <div className="bg-white p-4 rounded-lg border border-border">
      <h3 className="font-semibold text-gray-900 uppercase tracking-wide text-2xs mb-3 flex items-center gap-2">
        <ListDashesIcon weight="bold" size={13} className="text-primary" />
        Categories
      </h3>
      <TreeSelect
        data={treeSelectData}
        value={categoryId}
        onChange={(val) => setCategoryId(val || '')}
        placeholder="All Essentials"
        clearable
        searchable
      />
    </div>

    <div className="bg-white p-4 rounded-lg border border-border">
      <div className="flex flex-col gap-3">
        <Checkbox
          label={
            <div className="flex items-center gap-2">
              <PackageIcon size={15} className="text-gray-600" />
              <span className="text-sm">In stock only</span>
            </div>
          }
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.currentTarget.checked)}
          color="primary"
        />
      </div>

      <div className="h-px bg-border my-3" />

      <h3 className="font-semibold text-gray-900 uppercase tracking-wide text-2xs mb-3 flex items-center gap-2">
        <LeafIcon weight="fill" size={13} className="text-primary" />
        Sustainability
      </h3>
      <div className="flex flex-col gap-3">
        {MATERIAL_TYPE_OPTIONS.map(({ value, label, icon: Icon, color }) => (
          <Checkbox
            key={value}
            label={
              <div className="flex items-center gap-2">
                <Icon size={15} className={color} />
                <span className="text-sm">{label}</span>
              </div>
            }
            checked={selectedMaterialTypes.includes(value)}
            onChange={() => toggleMaterialType(value)}
            color="primary"
          />
        ))}
      </div>

      {materials.length > 0 && (
        <>
          <div className="h-px bg-border my-3" />
          <h4 className="font-medium text-gray-700 text-xs mb-2">Materials</h4>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
            {materials.map((material) => (
              <Checkbox
                key={material.id}
                label={
                  <span className="text-sm">
                    {material.name} <span className="text-muted-foreground">({material.productCount})</span>
                  </span>
                }
                checked={selectedMaterialIds.includes(material.id)}
                onChange={() => toggleMaterial(material.id)}
                color="primary"
              />
            ))}
          </div>
        </>
      )}
    </div>

    <div className="bg-white p-4 rounded-lg border border-border">
      <h3 className="font-semibold text-gray-900 uppercase tracking-wide text-2xs mb-3 flex items-center gap-2">
        <CurrencyDollarIcon weight="bold" size={13} className="text-primary" />
        Price Range
      </h3>
      <div className="flex flex-col gap-3 px-1">
        <div className="text-primary font-semibold text-sm text-center">
          {formatCurrency(priceRange[0])} –{' '}
          {priceRange[1] >= MAX_PRICE ? `${formatCurrency(MAX_PRICE)}+` : formatCurrency(priceRange[1])}
        </div>
        <RangeSlider
          color="primary"
          min={0}
          max={MAX_PRICE}
          step={10}
          value={priceRange}
          onChange={onPriceRangeChange}
          onChangeEnd={onPriceRangeChangeEnd}
          marks={[
            { value: 0, label: '$0' },
            { value: MAX_PRICE, label: `$${MAX_PRICE}+` },
          ]}
        />
      </div>
    </div>

    <button
      type="button"
      onClick={onClear}
      className="w-full py-2 px-4 bg-white border border-border text-gray-500 font-medium text-sm rounded-md hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
    >
      <XCircleIcon weight="fill" size={15} />
      Clear all filters
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
  const materialIds = useMemo(
    () => searchParams.get('materials')?.split(',').filter(Boolean) ?? [],
    [searchParams],
  )
  const materialTypes = useMemo(
    () => (searchParams.get('materialTypes')?.split(',').filter(Boolean) ?? []) as MaterialTypeEnum[],
    [searchParams],
  )
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
  const { data: materialsData } = useGetAllMaterials()
  const materials = materialsData ?? []

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
    materialIds: materialIds.length > 0 ? materialIds : undefined,
    minPrice: minPrice,
    maxPrice: maxPrice >= MAX_PRICE ? undefined : maxPrice,
    sortBy: sortBy,
    sortDescending: sortOrder === 'desc',
    materialTypes: materialTypes.length > 0 ? materialTypes : undefined,
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

  const toggleMaterial = (id: string) => {
    const next = materialIds.includes(id) ? materialIds.filter((m) => m !== id) : [...materialIds, id]
    updateParams({ materials: next.length > 0 ? next.join(',') : null })
  }

  const toggleMaterialType = (type: MaterialTypeEnum) => {
    const next = materialTypes.includes(type) ? materialTypes.filter((t) => t !== type) : [...materialTypes, type]
    updateParams({ materialTypes: next.length > 0 ? next.join(',') : null })
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
    materialIds.forEach((id) => {
      const material = materials.find((m) => m.id === id)
      if (material) {
        chips.push({ key: `material-${id}`, label: material.name, onRemove: () => toggleMaterial(id) })
      }
    })
    materialTypes.forEach((type) => {
      const option = MATERIAL_TYPE_OPTIONS.find((o) => o.value === type)
      if (option) {
        chips.push({ key: `material-type-${type}`, label: option.label, onRemove: () => toggleMaterialType(type) })
      }
    })
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
  }, [
    currentSearch,
    categoryId,
    selectedCategoryName,
    materialIds,
    materials,
    materialTypes,
    inStockOnly,
    minPrice,
    maxPrice,
  ])

  // Threaded into both the desktop sticky rail and the mobile Drawer — a single prop list,
  // rather than two independent copies of the same 15-line call.
  const filterPanelProps: FilterPanelProps = {
    treeSelectData,
    categoryId,
    setCategoryId: (v) => updateParams({ categoryId: v || null }),
    materials,
    selectedMaterialIds: materialIds,
    toggleMaterial,
    selectedMaterialTypes: materialTypes,
    toggleMaterialType,
    inStockOnly,
    setInStockOnly: (v) => updateParams({ inStock: v ? 'true' : null }, false),
    priceRange,
    onPriceRangeChange: setPriceRange,
    onPriceRangeChangeEnd: (v) =>
      updateParams({ minPrice: v[0] > 0 ? String(v[0]) : null, maxPrice: v[1] < MAX_PRICE ? String(v[1]) : null }),
    onClear: handleClearFilters,
  }

  const totalCount = productsData?.totalCount ?? 0

  return (
    <div className="bg-surface-sunken min-h-screen pb-section">
      <Seo
        title={currentSearch ? `Search: ${currentSearch}` : 'Shop Sustainable Essentials'}
        description="Browse eco-friendly, sustainable products with a transparent carbon footprint on every item."
      />

      <div className="border-b border-border bg-white">
        <Container width="wide" className="py-5">
          <PageBreadcrumbs items={breadcrumbItems} className="mb-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Sustainable Essentials</h1>
          <p className="mt-1 text-sm text-muted-foreground">{totalCount} products</p>
        </Container>
      </div>

      <Container width="wide" className="py-6">
        <div className="flex gap-8">
          {/* Desktop filter rail */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto pr-2 -mr-2 flex flex-col gap-4">
              <FilterPanel {...filterPanelProps} />
            </div>
          </aside>

          {/* Mobile filters drawer */}
          <Drawer opened={filtersOpen} onClose={() => setFiltersOpen(false)} position="left" size={300} title="Filters">
            <div className="flex flex-col gap-4">
              <FilterPanel {...filterPanelProps} />
            </div>
          </Drawer>

          <div className="min-w-0 flex-1">
            <Toolbar
              left={
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSearch()
                  }}
                  className="w-full sm:w-72"
                >
                  <Input
                    value={searchName}
                    onChange={(event) => setSearchName(event.currentTarget.value)}
                    placeholder="Search eco-friendly products..."
                    leftSection={<MagnifyingGlassIcon size={16} className="text-gray-400" />}
                  />
                </form>
              }
              right={
                <>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 bg-white border border-border text-gray-700 font-medium text-sm px-3 py-1.5 rounded-md hover:border-green-300 hover:text-primary transition-colors"
                  >
                    <FunnelIcon size={14} weight="bold" />
                    Filters
                  </button>
                  <Select
                    placeholder="Sort by"
                    value={`${sortBy}|${sortOrder}`}
                    onChange={(val) => {
                      const [newSortBy, newSortOrder] = (val || '').split('|')
                      updateParams({ sortBy: newSortBy, order: newSortOrder })
                    }}
                    className="w-full sm:w-56"
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
                  />
                </>
              }
            />

            {/* Active filter chips */}
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {activeFilterChips.map((chip) => (
                  <Badge
                    key={chip.key}
                    variant="light"
                    color="primary"
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
                  className="text-xs font-medium text-gray-400 hover:text-red-600 transition-colors ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {currentSearch && (
              <div className="bg-white px-4 py-3 rounded-lg flex items-center justify-between mb-4 border border-border">
                <p className="font-medium text-sm text-gray-700 flex items-center gap-2">
                  <MagnifyingGlassIcon size={16} className="text-primary" />
                  Search results for: <span className="font-semibold text-primary">"{currentSearch}"</span>
                  <span className="text-muted-foreground font-normal ml-1">({totalCount} products)</span>
                </p>
                <button
                  type="button"
                  onClick={() => updateParams({ search: null })}
                  className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-gray-50 hover:bg-red-50 px-2.5 py-1 rounded-full"
                >
                  <XCircleIcon weight="fill" size={13} />
                  Clear
                </button>
              </div>
            )}

            {isLoading ? (
              <ProductGrid variant="catalog">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader, static count
                    key={i}
                    className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-border"
                  >
                    <Skeleton height={160} radius="md" className="w-full aspect-[4/5]" />
                    <Skeleton height={16} radius="sm" className="w-3/4 mt-1" />
                    <Skeleton height={12} radius="sm" className="w-1/2" />
                  </div>
                ))}
              </ProductGrid>
            ) : isError ? (
              <EmptyState
                icon={WarningCircleIcon}
                color="red"
                title="Oops! Something went wrong"
                description="We couldn't load the products at this time. Please try refreshing the page."
                action={
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-2 py-2 px-4 text-sm bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
                  >
                    Refresh Page
                  </button>
                }
              />
            ) : visibleItems.length === 0 ? (
              <EmptyState
                icon={MagnifyingGlassIcon}
                color="gray"
                title="No products found"
                description={
                  inStockOnly && (productsData?.items?.length ?? 0) > 0
                    ? "No in-stock products on this page match your filters. Try clearing 'In stock only' or checking another page."
                    : "We couldn't find any products matching your current filters. Try adjusting your search criteria."
                }
                action={
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-2 py-2 px-4 text-sm bg-primary text-white font-medium rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2"
                  >
                    <XCircleIcon weight="fill" size={15} />
                    Clear all filters
                  </button>
                }
              />
            ) : (
              <>
                <ProductGrid variant="catalog">
                  {visibleItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </ProductGrid>

                {productsData && productsData.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      total={productsData.totalPages}
                      value={pageNumber}
                      onChange={handlePageChange}
                      withEdges
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ProductPage
