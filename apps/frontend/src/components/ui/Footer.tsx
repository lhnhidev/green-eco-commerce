import { LeafIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LeafIcon className="h-6 w-6" weight="fill" />
              <span className="text-xl font-semibold">GreenCart</span>
            </div>
            <p className="text-white/80 text-sm">
              Your trusted partner in bringing sustainable, eco-friendly products into your everyday life.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button type="button" onClick={() => navigate('/products')}>
                  All Products
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/products')}>
                  Zero Waste
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/products')}>
                  Home Essentials
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/products')}>
                  Personal Care
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button type="button" onClick={() => navigate('/remedies')}>
                  Sustainability Guide
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/feedback')}>
                  Feedback
                </button>
              </li>
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>support@greencart.com</li>
              <li>1-800-GREEN-CART</li>
              <li>Mon-Fri 9AM-6PM EST</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
          © 2025 GreenCart. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
