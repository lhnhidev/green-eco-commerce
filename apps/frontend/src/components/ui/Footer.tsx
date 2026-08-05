import { useGetAllCategories } from '@api'
import Container from '@components/ui/primitives/Container'
import { LeafIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

const Footer = () => {
  const { data: categories } = useGetAllCategories()

  const topCategories = [...(categories ?? [])]
    .filter((c) => !c.parentId)
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 3)

  return (
    <footer className="bg-primary text-white py-8">
      <Container>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LeafIcon className="h-5 w-5" weight="fill" />
              <span className="text-lg font-semibold">GreenCart</span>
            </div>
            <p className="text-white/80 text-sm">
              Your trusted partner in bringing sustainable, eco-friendly products into your everyday life.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Shop</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              <li>
                <Link to="/products">All Products</Link>
              </li>
              {topCategories.map((category) => (
                <li key={category.id}>
                  <Link to={`/products?categoryId=${category.id}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              <li>
                <Link to="/about">Sustainability Guide</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <a href="mailto:support@greencart.com">Feedback</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              <li>support@greencart.com</li>
              <li>1-800-GREEN-CART</li>
              <li>Mon-Fri 9AM-6PM EST</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-6 pt-6 text-center text-xs text-white/60">
          © {new Date().getFullYear()} GreenCart. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}

export default Footer
