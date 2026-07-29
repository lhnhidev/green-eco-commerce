import type { CategoryDto } from '@api/schemas'

export type CategoryTreeNode = {
  id: string
  name: string
  productCount: number
  children: CategoryTreeNode[]
}

export const buildCategoryTree = (categories: CategoryDto[]): CategoryTreeNode[] => {
  const nodeMap = new Map<string, CategoryTreeNode>()
  const roots: CategoryTreeNode[] = []

  categories.forEach((cat) => {
    nodeMap.set(cat.id, { id: cat.id, name: cat.name, productCount: cat.productCount, children: [] })
  })

  categories.forEach((cat) => {
    const node = nodeMap.get(cat.id)
    if (!node) return

    if (cat.parentId && nodeMap.has(cat.parentId)) {
      nodeMap.get(cat.parentId)?.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}
